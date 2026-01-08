package com.nefara.server.service.Document.DocumentServiceImp;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nefara.TextFormatter.TextFormatter;
import com.nefara.server.dto.Document.DocumentAnalysisDto;
import com.nefara.server.dto.Document.DocumentDashboardDto;
import com.nefara.server.dto.Document.DocumentDto;
import com.nefara.server.exeptions.ErrorExeption;
import com.nefara.server.exeptions.ValidationException;
import com.nefara.server.jwt.JwtUtils;
import com.nefara.server.mapper.Document.DocumentMapper;
import com.nefara.server.models.Document;
import com.nefara.server.models.User;
import com.nefara.server.repository.DocumentRepository;
import com.nefara.server.repository.UserRepository;
import com.nefara.server.service.Document.DocumentService;

import java.io.File;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    Cloudinary cloudinary;

    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    @Value("${fastapi.url}")
    String url;

    // 30KB max of text, 10MB file
    @Override
    public DocumentDto createDocument(MultipartFile file, String token) {

        if (file == null)
            throw new ValidationException("File is not provided!", HttpStatus.BAD_REQUEST);

        if (file.getSize() > 10 * 1024 * 1024)
            throw new ValidationException("File size exceeds the maximum limit of 10MB!", HttpStatus.BAD_REQUEST);

        String email;

        try {
            email = jwtUtils.getEmailFromToken(token);
        } catch (Exception e) {
            throw new ErrorExeption(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null)
            throw new ValidationException("The user with the given id does not exists!", HttpStatus.BAD_REQUEST);

        Document document = new Document();

        try {

            File tempFile = File.createTempFile("upload_", "_" + file.getOriginalFilename());
            file.transferTo(tempFile);

            String extracted_text;
            try {
                Tika tika = new Tika();
                tika.setMaxStringLength(10 * 1024 * 1024);
                extracted_text = tika.parseToString(tempFile);
            } catch (Exception e) {
                throw new ErrorExeption("Failed to extract text from file: " + e.getMessage(), HttpStatus.BAD_REQUEST);
            }

            String extracted_text_formated = TextFormatter.convertToNumberedList(extracted_text);

            if (extracted_text_formated.length() > 30000) {
                tempFile.delete();
                throw new ValidationException(
                        "Text size exceeds the maximum limit for analysis! Maximum allowed is 30KB (approx. 5-10 pages).",
                        HttpStatus.BAD_REQUEST);
            }

            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> uploadResult = cloudinary.uploader().upload(
                        tempFile,
                        ObjectUtils.asMap(
                                "folder", "Fylex/documents",
                                "public_id", "document_for_user_" + user.getId() + "_" + System.currentTimeMillis(),
                                "overwrite", true,
                                "resource_type", "raw"));

                String modelResponse = modelResponse(extracted_text_formated, document);

                String file_name = file.getOriginalFilename();

                addInfoToDocument(modelResponse, document, extracted_text_formated, file_name);

                document.setUser(user);

            } catch (Exception e) {

                if (e instanceof ValidationException)
                    throw (ValidationException) e;
                throw new ErrorExeption(e.getMessage(), HttpStatus.BAD_REQUEST);
            } finally {
                if (tempFile.exists())
                    tempFile.delete();
            }

        } catch (IOException e) {
            throw new ValidationException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        Document saved_document = documentRepository.save(document);

        return DocumentMapper.mapToDto(saved_document);
    }

    @Override
    public List<DocumentDashboardDto> getUserDocuments(String token) {

        String email = jwtUtils.getEmailFromToken(token);
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null)
            throw new ValidationException("There is no user with the given email from the token!",
                    HttpStatus.BAD_REQUEST);

        List<Document> documents = documentRepository.findAllByUserId(user.getId());

        List<DocumentDashboardDto> response = documents.stream().map(u -> DocumentMapper.mapToDashboardDto(u))
                .collect(Collectors.toList());

        return response;
    }

    public String modelResponse(String text, Document document) {
        HttpClient client = getHttpClient();
        ObjectMapper mapper = new ObjectMapper();

        try {
            Map<String, String> bodyMap = new HashMap<>();
            bodyMap.put("text", text);

            String jsonBody = mapper.writeValueAsString(bodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                documentRepository.delete(document);
                throw new ErrorExeption(
                        "Model service error: " + response.statusCode() + " - " + response.body(),
                        HttpStatus.BAD_REQUEST);
            }

            return response.body();

        } catch (Exception e) {
            throw new ErrorExeption(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    protected HttpClient getHttpClient() {
        return HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();
    }

    public void addInfoToDocument(String modelResponse, Document document, String convertedText, String fileName) {

        if (document == null)
            throw new ValidationException("There is no document with the given id!", HttpStatus.BAD_REQUEST);

        ObjectMapper mapper = new ObjectMapper();

        JsonNode root;

        try {
            root = mapper.readTree(modelResponse);
        } catch (Exception e) {
            throw new ErrorExeption(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        String timeDuration = root.path("time").asText();
        Double percentage = root.path("percentage").asDouble();
        String overAllSafety = root.path("overall").asText();
        double durationInSeconds = Double.parseDouble(timeDuration.replace(" seconds", "").trim());

        document.setResponseTime(durationInSeconds);
        document.setDocumentText(convertedText);
        document.setName(fileName);
        document.setTextAnalysis(modelResponse);

        document.setRiskLevel(overAllSafety);
        document.setSecurityPercentage(percentage);

    }

    @Override
    public DocumentDto getDocumentById(String token, Long id) {

        String email;

        try {
            email = jwtUtils.getEmailFromToken(token);
        } catch (Exception e) {
            throw new ValidationException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null)
            throw new ValidationException("No user with the email from the token found!", HttpStatus.BAD_REQUEST);

        Document document = documentRepository.findById(id).orElse(null);
        if (document == null)
            throw new ValidationException("There is no document with the given id!", HttpStatus.BAD_REQUEST);

        if (document.getUser().getId() == user.getId()) {
            return DocumentMapper.mapToDto(document);
        } else {
            throw new ValidationException("The document is not for this user!", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public DocumentAnalysisDto getDashboardAnalisys(String token) {
        String email = jwtUtils.getEmailFromToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("No user with the token's email!", HttpStatus.BAD_REQUEST));

        List<Document> documents = documentRepository.findAllByUserId(user.getId());

        long totalSkans = 0;
        long threadsDetected = 0;
        long cleanDocuments = 0;
        double totalScanTime = 0.0;

        long last7_totalSkans = 0, prev7_totalSkans = 0;
        long last7_threadsDetected = 0, prev7_threadsDetected = 0;
        long last7_cleanDocuments = 0, prev7_cleanDocuments = 0;
        double last7_totalScanTime = 0.0, prev7_totalScanTime = 0.0;

        ObjectMapper objectMapper = new ObjectMapper();
        LocalDate today = LocalDate.now();

        for (Document doc : documents) {
            totalSkans++;
            totalScanTime += doc.getResponseTime();

            long docThreadsDetected = 0;
            boolean isClean = false;

            String response = doc.getTextAnalysis();
            if (response == null || response.isBlank()) {
                isClean = true;
            } else {
                try {
                    JsonNode root = objectMapper.readTree(response);
                    JsonNode analysis = root.get("analysis");
                    if (analysis != null && analysis.isArray()) {
                        if (analysis.size() == 0)
                            isClean = true;
                        else
                            docThreadsDetected = analysis.size();
                    } else
                        isClean = true;
                } catch (Exception e) {

                    isClean = true;
                }
            }

            if (isClean)
                cleanDocuments++;
            else
                threadsDetected += docThreadsDetected;

            LocalDate updated = doc.getUpdatedDate();
            if (updated != null) {
                long daysAgo = ChronoUnit.DAYS.between(updated, today);
                if (daysAgo >= 0 && daysAgo <= 6) {
                    last7_totalSkans++;
                    last7_threadsDetected += docThreadsDetected;
                    last7_cleanDocuments += isClean ? 1 : 0;
                    last7_totalScanTime += doc.getResponseTime();
                } else if (daysAgo >= 7 && daysAgo <= 13) {
                    prev7_totalSkans++;
                    prev7_threadsDetected += docThreadsDetected;
                    prev7_cleanDocuments += isClean ? 1 : 0;
                    prev7_totalScanTime += doc.getResponseTime();
                }
            }
        }

        double avgScanTime = totalSkans > 0 ? totalScanTime / totalSkans : 0.0;

        double last7_totalSkansAvg = last7_totalSkans > 0 ? last7_totalSkans / 7.0 : 0.0;
        double prev7_totalSkansAvg = prev7_totalSkans > 0 ? prev7_totalSkans / 7.0 : 0.0;

        double last7_threadsAvg = last7_threadsDetected > 0 ? last7_threadsDetected / 7.0 : 0.0;
        double prev7_threadsAvg = prev7_threadsDetected > 0 ? prev7_threadsDetected / 7.0 : 0.0;

        double last7_cleanAvg = last7_cleanDocuments > 0 ? last7_cleanDocuments / 7.0 : 0.0;
        double prev7_cleanAvg = prev7_cleanDocuments > 0 ? prev7_cleanDocuments / 7.0 : 0.0;

        double last7_scanTimeAvg = last7_totalSkans > 0 ? last7_totalScanTime / last7_totalSkans : 0.0;
        double prev7_scanTimeAvg = prev7_totalSkans > 0 ? prev7_totalScanTime / prev7_totalSkans : 0.0;

        long totalSkansDiffPercentage = Math.round(last7_totalSkansAvg - prev7_totalSkansAvg);
        long threadsDetectedDiffPercentage = Math.round(last7_threadsAvg - prev7_threadsAvg);
        long cleanDocumentsDiffPercentage = Math.round(last7_cleanAvg - prev7_cleanAvg);
        long avgScanTimeDiffPercentage = Math.round(last7_scanTimeAvg - prev7_scanTimeAvg);

        DocumentAnalysisDto dto = new DocumentAnalysisDto();
        dto.setTotalSkans(totalSkans);
        dto.setThreadsDetected(threadsDetected);
        dto.setCleanDocuments(cleanDocuments);
        dto.setAvgScanTime(avgScanTime);

        dto.setTotalSkansPersentage(totalSkansDiffPercentage);
        dto.setThreadsDetectedPersentage(threadsDetectedDiffPercentage);
        dto.setCleanDocumentsPersentage(cleanDocumentsDiffPercentage);
        dto.setAvgScanTimePersentage(avgScanTimeDiffPercentage);

        return dto;
    }

}
package com.nefara.server.service.Document.DocumentServiceImp;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.nefara.server.dto.Document.DocumentAnalysisDto;
import com.nefara.server.dto.Document.DocumentDashboardDto;
import com.nefara.server.dto.Document.DocumentDto;
import com.nefara.server.exeptions.ErrorExeption;
import com.nefara.server.exeptions.ValidationException;
import com.nefara.server.jwt.JwtUtils;
import com.nefara.server.models.Document;
import com.nefara.server.models.User;
import com.nefara.server.repository.DocumentRepository;
import com.nefara.server.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentServiceImplTest {

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserRepository userRepository;

    @Spy
    @InjectMocks
    private DocumentServiceImpl documentService;

    private User testUser;
    private String token = "valid.token.here";
    private String userEmail = "test@example.com";

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail(userEmail);

        ReflectionTestUtils.setField(documentService, "url", "http://fastapi-url");
    }

    @Test
    void createDocument_Success() throws Exception {
        String fileContent = "This is a test document content.";
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                fileContent.getBytes());

        when(jwtUtils.getEmailFromToken(token)).thenReturn(userEmail);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));
        when(cloudinary.uploader()).thenReturn(uploader);
        when(uploader.upload(any(), anyMap())).thenReturn(Map.of("url", "http://cloudinary.url"));

        String mockModelResponse = "{"
                + "\"time\": \"0.5 seconds\","
                + "\"percentage\": 95.0,"
                + "\"overall\": \"Safe\","
                + "\"analysis\": []"
                + "}";
        doReturn(mockModelResponse).when(documentService).modelResponse(anyString(), any(Document.class));

        when(documentRepository.save(any(Document.class))).thenAnswer(invocation -> {
            Document doc = invocation.getArgument(0);
            doc.setId(100L);
            return doc;
        });

        DocumentDto result = documentService.createDocument(file, token);

        assertNotNull(result);
        assertEquals("test.txt", result.getName());
        assertEquals("Safe", result.getRiskLevel());
        verify(documentRepository).save(any(Document.class));
        verify(cloudinary.uploader()).upload(any(), anyMap());
    }

    @Test
    void createDocument_FileNull_ThrowsException() {
        assertThrows(ValidationException.class, () -> {
            documentService.createDocument(null, token);
        });
    }

    @Test
    void createDocument_FileSizeExceeds_ThrowsException() {
        byte[] largeContent = new byte[(10 * 1024 * 1024) + 1];
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "large.txt",
                "text/plain",
                largeContent);

        assertThrows(ValidationException.class, () -> {
            documentService.createDocument(file, token);
        });
    }

    @Test
    void createDocument_UserNotFound_ThrowsException() {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "content".getBytes());
        when(jwtUtils.getEmailFromToken(token)).thenReturn(userEmail);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        assertThrows(ValidationException.class, () -> {
            documentService.createDocument(file, token);
        });
    }

    @Test
    void getUserDocuments_Success() {
        when(jwtUtils.getEmailFromToken(token)).thenReturn(userEmail);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));

        List<Document> documents = new ArrayList<>();
        Document doc1 = new Document();
        doc1.setId(1L);
        doc1.setUser(testUser);
        documents.add(doc1);

        when(documentRepository.findAllByUserId(testUser.getId())).thenReturn(documents);

        List<DocumentDashboardDto> result = documentService.getUserDocuments(token);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
    }

    @Test
    void getDocumentById_Success() {
        when(jwtUtils.getEmailFromToken(token)).thenReturn(userEmail);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));

        Document doc = new Document();
        doc.setId(5L);
        doc.setUser(testUser);

        when(documentRepository.findById(5L)).thenReturn(Optional.of(doc));

        DocumentDto result = documentService.getDocumentById(token, 5L);

        assertNotNull(result);
        assertEquals(5L, result.getId());
    }

    @Test
    void getDocumentById_UserMismatch_ThrowsException() {
        when(jwtUtils.getEmailFromToken(token)).thenReturn(userEmail);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));

        User otherUser = new User();
        otherUser.setId(2L);

        Document doc = new Document();
        doc.setId(5L);
        doc.setUser(otherUser);

        when(documentRepository.findById(5L)).thenReturn(Optional.of(doc));

        assertThrows(ValidationException.class, () -> {
            documentService.getDocumentById(token, 5L);
        });
    }

    @Test
    void getDashboardAnalisys_Success() {
        when(jwtUtils.getEmailFromToken(token)).thenReturn(userEmail);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(testUser));

        List<Document> documents = new ArrayList<>();

        Document doc1 = new Document();
        doc1.setResponseTime(1.0);
        doc1.setTextAnalysis("{\"analysis\": []}");
        doc1.setUpdatedDate(LocalDate.now());

        Document doc2 = new Document();
        doc2.setResponseTime(2.0);
        doc2.setTextAnalysis("{\"analysis\": [1, 2, 3]}");
        doc2.setUpdatedDate(LocalDate.now());

        documents.add(doc1);
        documents.add(doc2);

        when(documentRepository.findAllByUserId(testUser.getId())).thenReturn(documents);

        DocumentAnalysisDto result = documentService.getDashboardAnalisys(token);

        assertEquals(2, result.getTotalSkans());
        assertEquals(3, result.getThreadsDetected());
        assertEquals(1, result.getCleanDocuments());
        assertEquals(1.5, result.getAvgScanTime());
    }

    @Test
    void modelResponse_Success() throws Exception {
        String text = "analyzethis";
        Document doc = new Document();
        String expectedResponse = "{\"result\":\"ok\"}";

        HttpClient mockClient = mock(HttpClient.class);
        HttpResponse<String> mockResponse = mock(HttpResponse.class);

        doReturn(mockClient).when(documentService).getHttpClient();
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn(expectedResponse);

        doReturn(mockResponse).when(mockClient).send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class));

        String result = documentService.modelResponse(text, doc);

        assertEquals(expectedResponse, result);
    }

    @Test
    void modelResponse_Failure() throws Exception {
        String text = "analyzethis";
        Document doc = new Document();

        HttpClient mockClient = mock(HttpClient.class);
        HttpResponse<String> mockResponse = mock(HttpResponse.class);

        doReturn(mockClient).when(documentService).getHttpClient();
        when(mockResponse.statusCode()).thenReturn(500);
        when(mockResponse.body()).thenReturn("Error");

        doReturn(mockResponse).when(mockClient).send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class));

        try {
            documentService.modelResponse(text, doc);
            fail("Should have thrown exception");
        } catch (Exception e) {
            verify(documentRepository).delete(doc);
        }
    }

    @Test
    void addInfoToDocument_Success() {
        Document doc = new Document();
        String modelResponse = "{"
                + "\"time\": \"1.5 seconds\","
                + "\"percentage\": 80.0,"
                + "\"overall\": \"Risky\""
                + "}";
        String convertedText = "1. First line";
        String fileName = "doc.txt";

        documentService.addInfoToDocument(modelResponse, doc, convertedText, fileName);

        assertEquals(1.5, doc.getResponseTime());
        assertEquals(80.0, doc.getSecurityPercentage());
        assertEquals("Risky", doc.getRiskLevel());
        assertEquals(convertedText, doc.getDocumentText());
        assertEquals(fileName, doc.getName());
    }

    @Test
    void addInfoToDocument_InvalidJson_ThrowsException() {
        Document doc = new Document();
        String invalidJson = "{ invalid json }";

        assertThrows(ErrorExeption.class, () -> {
            documentService.addInfoToDocument(invalidJson, doc, "text", "name");
        });
    }
}

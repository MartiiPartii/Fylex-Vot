package com.nefara.server.service.Document;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.nefara.server.dto.Document.DocumentAnalysisDto;
import com.nefara.server.dto.Document.DocumentDashboardDto;
import com.nefara.server.dto.Document.DocumentDto;

public interface DocumentService {
    public DocumentDto createDocument(MultipartFile file, String token);

    public List<DocumentDashboardDto> getUserDocuments(String token);

    public DocumentDto getDocumentById(String token, Long id);

    public DocumentAnalysisDto getDashboardAnalisys(String token);
}
package com.nefara.server.mapper.Document;

import com.nefara.server.dto.Document.DocumentDashboardDto;
import com.nefara.server.dto.Document.DocumentDto;
import com.nefara.server.models.Document;

public class DocumentMapper {

    public static DocumentDto mapToDto(Document document) {
        return new DocumentDto(
            document.getId(),
            document.getName(),
            document.getDocumentText(),
            document.getTextAnalysis(),
            document.getSecurityPercentage(),
            document.getResponseTime(),
            document.getRiskLevel(),
            document.getUpdatedDate(),
            document.getUser().getId()
        );
    }

    public static DocumentDashboardDto mapToDashboardDto(Document document) {
        return new DocumentDashboardDto(
            document.getId(),
            document.getName(),
            document.getRiskLevel()
        );
    }
}
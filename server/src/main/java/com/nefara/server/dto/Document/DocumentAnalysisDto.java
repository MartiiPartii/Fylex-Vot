package com.nefara.server.dto.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentAnalysisDto {
    private Long totalSkans;
    private Long threadsDetected;
    private Long cleanDocuments;
    private double avgScanTime;

    private Long totalSkansPersentage;
    private Long threadsDetectedPersentage;
    private Long cleanDocumentsPersentage;
    private Long avgScanTimePersentage;
}
package com.nefara.server.dto.Document;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentDto {
    private Long id;
    private String name;
    private String documentText;
    private String textAnalysis;
    private double securityPercentage;
    private double responseTime;
    private String riskLevel;
    private LocalDate updatedDate;
    private Long userId;
}
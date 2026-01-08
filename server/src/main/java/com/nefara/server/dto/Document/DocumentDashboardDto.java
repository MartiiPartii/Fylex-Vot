package com.nefara.server.dto.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentDashboardDto {
    private Long id;
    private String name;
    private String riskLevel;
}

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileUrls?: string;
};

export type DocumentAnalysis = {
    issues?: Array<{
        risk_level: 'low' | 'medium' | 'high';
        type: string;
        line: number;
        sentence: string;
        explanation: string;
    }>;
    threats?: number;
};

export type Document = {
    id: string;
    name: string;
    uploadDate: string;
    status: 'clean' | 'threat' | 'processing';
    riskLevel?: string;
    securityPercentage: number;
    textAnalysis?: string; // JSON string
    documentText?: string;
    responseTime?: string;
};

export type Stats = {
    totalSkans: number;
    totalSkansPersentage: number;
    threadsDetected: number;
    threadsDetectedPersentage: number;
    cleanDocuments: number;
    cleanDocumentsPersentage: number;
    avgScanTime: number;
    avgScanTimePersentage: number;
};


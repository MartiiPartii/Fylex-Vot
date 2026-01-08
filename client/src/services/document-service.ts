/**
 * Document Service
 * 
 * Pure business logic extracted from utils/actions/document.ts
 * No HTTP requests, no side effects, no framework dependencies.
 */

import { DocumentAnalysis } from "~/types";

export interface ParsedDocumentAnalysis {
    issues: DocumentAnalysis['issues'];
    threats: number;
}

export interface ProcessedDocument {
    issues: DocumentAnalysis['issues'];
    threats: number;
    textLines: string[];
    securityScore: number;
}

/**
 * Parse document analysis from JSON string
 * Extracted from: utils/actions/document.ts (handleGetDocument, lines 32-41)
 * @param textAnalysis - JSON string containing analysis data
 * @returns Parsed analysis or null if invalid
 */
export function parseDocumentAnalysis(textAnalysis: string | undefined): ParsedDocumentAnalysis | null {
    if (!textAnalysis) {
        return null;
    }

    try {
        const parsed = JSON.parse(textAnalysis) as { analysis: DocumentAnalysis['issues'] };
        const issues = parsed.analysis;
        const threats = issues ? issues.length : 0;

        return { issues, threats };
    } catch (error) {
        return null;
    }
}

/**
 * Calculate security score from percentage
 * Extracted from: utils/actions/document.ts (handleGetDocument, lines 46-47)
 * @param percentage - Raw security percentage
 * @returns Rounded security score
 */
export function calculateSecurityScore(percentage: number | undefined): number {
    const safePercentage = percentage || 0;
    return Number(safePercentage.toFixed(2));
}

/**
 * Split document text into lines
 * Extracted from: utils/actions/document.ts (handleGetDocument, line 44)
 * @param documentText - Full document text
 * @returns Array of text lines
 */
export function splitDocumentText(documentText: string | undefined): string[] {
    if (!documentText) {
        return [];
    }
    return documentText.split("\n");
}

/**
 * Process raw document data into structured format
 * Orchestrates the three extraction functions above
 * @param rawDocument - Raw document from API
 * @returns Processed document with analysis
 */
export function processDocument(rawDocument: {
    textAnalysis?: string;
    documentText?: string;
    securityPercentage?: number;
}): ProcessedDocument {
    const analysisResult = parseDocumentAnalysis(rawDocument.textAnalysis);
    const textLines = splitDocumentText(rawDocument.documentText);
    const securityScore = calculateSecurityScore(rawDocument.securityPercentage);

    return {
        issues: analysisResult?.issues || undefined,
        threats: analysisResult?.threats || 0,
        textLines,
        securityScore
    };
}

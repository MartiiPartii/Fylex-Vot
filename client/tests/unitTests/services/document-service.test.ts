import { describe, it, expect, beforeEach } from "vitest";
import {
  parseDocumentAnalysis,
  calculateSecurityScore,
  splitDocumentText,
  processDocument,
} from "~/services/document-service";

describe("document-service", () => {
  describe("parseDocumentAnalysis", () => {
    it("TC001: should parse valid JSON analysis string", () => {
      // Arrange
      const analysis = [
        { type: "error", message: "Issue 1" },
        { type: "warning", message: "Issue 2" },
      ];
      const textAnalysis = JSON.stringify({ analysis });

      // Act
      const result = parseDocumentAnalysis(textAnalysis);

      // Assert
      expect(result).toEqual({
        issues: analysis,
        threats: 2,
      });
    });

    it("TC002: should return null for undefined input", () => {
      // Arrange
      const textAnalysis = undefined;

      // Act
      const result = parseDocumentAnalysis(textAnalysis);

      // Assert
      expect(result).toBeNull();
    });

    it("TC003: should return null for empty string", () => {
      // Arrange
      const textAnalysis = "";

      // Act
      const result = parseDocumentAnalysis(textAnalysis);

      // Assert
      expect(result).toBeNull();
    });

    it("TC004: should return null for invalid JSON", () => {
      // Arrange
      const textAnalysis = "invalid json";

      // Act
      const result = parseDocumentAnalysis(textAnalysis);

      // Assert
      expect(result).toBeNull();
    });

    it("TC005: should handle empty analysis array", () => {
      // Arrange
      const textAnalysis = JSON.stringify({ analysis: [] });

      // Act
      const result = parseDocumentAnalysis(textAnalysis);

      // Assert
      expect(result).toEqual({
        issues: [],
        threats: 0,
      });
    });

    it("TC006: should handle missing analysis property", () => {
      // Arrange
      const textAnalysis = JSON.stringify({});

      // Act
      const result = parseDocumentAnalysis(textAnalysis);

      // Assert
      expect(result).toEqual({
        issues: undefined,
        threats: 0,
      });
    });

    it("TC007: should handle null analysis", () => {
      // Arrange
      const textAnalysis = JSON.stringify({ analysis: null });

      // Act
      const result = parseDocumentAnalysis(textAnalysis);

      // Assert
      expect(result).toEqual({
        issues: null,
        threats: 0,
      });
    });
  });

  describe("calculateSecurityScore", () => {
    it("TC008: should round percentage to 2 decimal places", () => {
      // Arrange
      const percentage = 85.123456;

      // Act
      const result = calculateSecurityScore(percentage);

      // Assert
      expect(result).toBe(85.12);
    });

    it("TC009: should handle undefined percentage", () => {
      // Arrange
      const percentage = undefined;

      // Act
      const result = calculateSecurityScore(percentage);

      // Assert
      expect(result).toBe(0);
    });

    it("TC010: should handle zero percentage", () => {
      // Arrange
      const percentage = 0;

      // Act
      const result = calculateSecurityScore(percentage);

      // Assert
      expect(result).toBe(0);
    });

    it("TC011: should handle 100 percentage", () => {
      // Arrange
      const percentage = 100;

      // Act
      const result = calculateSecurityScore(percentage);

      // Assert
      expect(result).toBe(100);
    });

    it("TC012: should handle negative percentage", () => {
      // Arrange
      const percentage = -10.567;

      // Act
      const result = calculateSecurityScore(percentage);

      // Assert
      expect(result).toBe(-10.57);
    });
  });

  describe("splitDocumentText", () => {
    it("TC013: should split text by newlines", () => {
      // Arrange
      const documentText = "Line 1\nLine 2\nLine 3";

      // Act
      const result = splitDocumentText(documentText);

      // Assert
      expect(result).toEqual(["Line 1", "Line 2", "Line 3"]);
    });

    it("TC014: should return empty array for undefined", () => {
      // Arrange
      const documentText = undefined;

      // Act
      const result = splitDocumentText(documentText);

      // Assert
      expect(result).toEqual([]);
    });

    it("TC015: should return empty array for empty string", () => {
      // Arrange
      const documentText = "";

      // Act
      const result = splitDocumentText(documentText);

      // Assert
      expect(result).toEqual([]);
    });

    it("TC016: should handle text with multiple consecutive newlines", () => {
      // Arrange
      const documentText = "Line 1\n\nLine 3";

      // Act
      const result = splitDocumentText(documentText);

      // Assert
      expect(result).toEqual(["Line 1", "", "Line 3"]);
    });

    it("TC017: should handle single line text", () => {
      // Arrange
      const documentText = "Single line";

      // Act
      const result = splitDocumentText(documentText);

      // Assert
      expect(result).toEqual(["Single line"]);
    });
  });

  describe("processDocument", () => {
    it("TC018: should process complete document with all fields", () => {
      // Arrange
      const analysis = [{ type: "error", message: "Issue" }];
      const textAnalysis = JSON.stringify({ analysis });
      const documentText = "Line 1\nLine 2";
      const securityPercentage = 85.5;

      const rawDocument = {
        textAnalysis,
        documentText,
        securityPercentage,
      };

      // Act
      const result = processDocument(rawDocument);

      // Assert
      expect(result).toEqual({
        issues: analysis,
        threats: 1,
        textLines: ["Line 1", "Line 2"],
        securityScore: 85.5,
      });
    });

    it("TC019: should handle document with missing fields", () => {
      // Arrange
      const rawDocument = {};

      // Act
      const result = processDocument(rawDocument);

      // Assert
      expect(result).toEqual({
        issues: undefined,
        threats: 0,
        textLines: [],
        securityScore: 0,
      });
    });

    it("TC020: should handle document with only textAnalysis", () => {
      // Arrange
      const analysis = [{ type: "warning", message: "Warning" }];
      const textAnalysis = JSON.stringify({ analysis });
      const rawDocument = { textAnalysis };

      // Act
      const result = processDocument(rawDocument);

      // Assert
      expect(result).toEqual({
        issues: analysis,
        threats: 1,
        textLines: [],
        securityScore: 0,
      });
    });

    it("TC021: should handle document with only documentText", () => {
      // Arrange
      const documentText = "Test document";
      const rawDocument = { documentText };

      // Act
      const result = processDocument(rawDocument);

      // Assert
      expect(result).toEqual({
        issues: undefined,
        threats: 0,
        textLines: ["Test document"],
        securityScore: 0,
      });
    });

    it("TC022: should handle document with only securityPercentage", () => {
      // Arrange
      const rawDocument = { securityPercentage: 90.123 };

      // Act
      const result = processDocument(rawDocument);

      // Assert
      expect(result).toEqual({
        issues: undefined,
        threats: 0,
        textLines: [],
        securityScore: 90.12,
      });
    });

    it("TC023: should handle invalid textAnalysis gracefully", () => {
      // Arrange
      const rawDocument = {
        textAnalysis: "invalid json",
        documentText: "Test",
        securityPercentage: 75,
      };

      // Act
      const result = processDocument(rawDocument);

      // Assert
      expect(result).toEqual({
        issues: undefined,
        threats: 0,
        textLines: ["Test"],
        securityScore: 75,
      });
    });
  });
});


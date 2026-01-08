import { describe, it, expect, beforeEach } from "vitest";
import {
  isNextRedirect,
  extractErrorMessage,
  createErrorResponse,
  createSuccessResponse,
} from "~/services/error-service";

describe("error-service", () => {
  describe("isNextRedirect", () => {
    it("TC001: should return true for Next.js redirect error with NEXT_REDIRECT digest", () => {
      // Arrange
      const error = {
        digest: "NEXT_REDIRECT;/dashboard",
      };

      // Act
      const result = isNextRedirect(error);

      // Assert
      expect(result).toBe(true);
    });

    it("TC002: should return false for error without digest", () => {
      // Arrange
      const error = new Error("Some error");

      // Act
      const result = isNextRedirect(error);

      // Assert
      expect(result).toBe(false);
    });

    it("TC003: should return false for error with non-NEXT_REDIRECT digest", () => {
      // Arrange
      const error = {
        digest: "SOME_OTHER_DIGEST",
      };

      // Act
      const result = isNextRedirect(error);

      // Assert
      expect(result).toBe(false);
    });

    it("TC004: should return false for null/undefined", () => {
      // Arrange
      const error1 = null;
      const error2 = undefined;

      // Act
      const result1 = isNextRedirect(error1);
      const result2 = isNextRedirect(error2);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it("TC005: should return false for non-object", () => {
      // Arrange
      const error = "string error";

      // Act
      const result = isNextRedirect(error);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("extractErrorMessage", () => {
    it("TC006: should extract error message from FetchError response", () => {
      // Arrange
      const error = {
        response: {
          data: {
            error: "Invalid credentials",
          },
        },
      };

      // Act
      const result = extractErrorMessage(error);

      // Assert
      expect(result).toBe("Invalid credentials");
    });

    it("TC007: should extract error message from standard Error", () => {
      // Arrange
      const error = new Error("Something went wrong");

      // Act
      const result = extractErrorMessage(error);

      // Assert
      expect(result).toBe("Something went wrong");
    });

    it("TC008: should return default message for technical error in FetchError", () => {
      // Arrange
      const error = {
        response: {
          data: {
            error: "fetch failed",
          },
        },
      };

      // Act
      const result = extractErrorMessage(error, "Custom default");

      // Assert
      expect(result).toBe("Custom default");
    });

    it("TC009: should return default message for technical error in Error", () => {
      // Arrange
      const error = new Error("NetworkError: Failed to fetch");

      // Act
      const result = extractErrorMessage(error, "Custom default");

      // Assert
      expect(result).toBe("Custom default");
    });

    it("TC010: should return default message for unknown error type", () => {
      // Arrange
      const error = { someProperty: "value" };

      // Act
      const result = extractErrorMessage(error, "Default message");

      // Assert
      expect(result).toBe("Default message");
    });

    it("TC011: should return default message for null/undefined", () => {
      // Arrange
      const error1 = null;
      const error2 = undefined;

      // Act
      const result1 = extractErrorMessage(error1, "Default");
      const result2 = extractErrorMessage(error2, "Default");

      // Assert
      expect(result1).toBe("Default");
      expect(result2).toBe("Default");
    });

    it("TC012: should handle FetchError without data.error", () => {
      // Arrange
      const error = {
        response: {
          data: {},
        },
      };

      // Act
      const result = extractErrorMessage(error, "Default");

      // Assert
      expect(result).toBe("Default");
    });

    it("TC013: should handle various technical error patterns", () => {
      // Arrange
      const technicalErrors = [
        "fetch failed",
        "Failed to fetch",
        "Network error",
        "NetworkError",
        "TypeError",
        "Request failed",
        "Connection",
        "ECONNREFUSED",
        "ENOTFOUND",
        "Timeout",
      ];

      technicalErrors.forEach((errorMsg) => {
        const error = new Error(errorMsg);

        // Act
        const result = extractErrorMessage(error, "Default message");

        // Assert
        expect(result).toBe("Default message");
      });
    });
  });

  describe("createErrorResponse", () => {
    it("TC014: should create error response with extracted message", () => {
      // Arrange
      const error = new Error("Custom error message");

      // Act
      const result = createErrorResponse(error, "Default message");

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Custom error message",
      });
    });

    it("TC015: should create error response with default message for technical error", () => {
      // Arrange
      const error = new Error("fetch failed");

      // Act
      const result = createErrorResponse(error, "Something went wrong");

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Something went wrong",
      });
    });

    it("TC016: should throw Next.js redirect error", () => {
      // Arrange
      const error = {
        digest: "NEXT_REDIRECT;/dashboard",
      };

      // Act & Assert
      expect(() => createErrorResponse(error)).toThrow();
    });

    it("TC017: should use default message when error has no message", () => {
      // Arrange
      const error = {};

      // Act
      const result = createErrorResponse(error, "Default error");

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Default error",
      });
    });
  });

  describe("createSuccessResponse", () => {
    it("TC018: should create success response with data", () => {
      // Arrange
      const data = { id: "123", name: "Test" };

      // Act
      const result = createSuccessResponse(data);

      // Assert
      expect(result).toEqual({
        success: true,
        data,
      });
    });

    it("TC019: should create success response with null data", () => {
      // Arrange
      const data = null;

      // Act
      const result = createSuccessResponse(data);

      // Assert
      expect(result).toEqual({
        success: true,
        data: null,
      });
    });

    it("TC020: should create success response with undefined data", () => {
      // Arrange
      const data = undefined;

      // Act
      const result = createSuccessResponse(data);

      // Assert
      expect(result).toEqual({
        success: true,
        data: undefined,
      });
    });
  });
});


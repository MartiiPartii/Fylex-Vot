import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Integration Test: Error Handling Flow
 * 
 * Tests error handling across multiple layers, ensuring technical errors
 * are filtered and user-friendly messages are returned.
 */

// Mock external services
vi.mock("~/infrastructure/http/fetch-client", () => ({
  httpRequest: vi.fn(),
}));

// Use real implementations for error-service
import { createErrorResponse, extractErrorMessage } from "~/services/error-service";
import { httpRequest } from "~/infrastructure/http/fetch-client";

describe("Error Handling Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should filter technical errors and return user-friendly messages", () => {
    // Arrange
    const technicalError = new Error("fetch failed");

    // Act
    const result = createErrorResponse(technicalError, "Something went wrong");

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("Something went wrong");
  });

  it("TC002: should preserve user-friendly error messages from API", () => {
    // Arrange
    const apiError = {
      response: {
        data: {
          error: "Email already exists",
        },
      },
    };

    // Act
    const result = createErrorResponse(apiError, "Default error");

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("Email already exists");
  });

  it("TC003: should extract error from FetchError format", () => {
    // Arrange
    const fetchError = {
      response: {
        data: {
          error: "Invalid credentials",
        },
      },
    };

    // Act
    const message = extractErrorMessage(fetchError, "Default");

    // Assert
    expect(message).toBe("Invalid credentials");
  });

  it("TC004: should filter technical errors from FetchError", () => {
    // Arrange
    const fetchError = {
      response: {
        data: {
          error: "NetworkError: Failed to fetch",
        },
      },
    };

    // Act
    const message = extractErrorMessage(fetchError, "Connection error");

    // Assert
    expect(message).toBe("Connection error");
  });
});


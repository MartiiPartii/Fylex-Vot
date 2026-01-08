import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Integration Test: Authentication Flow
 * 
 * Tests the complete authentication flow from action to API client,
 * using real implementations of internal layers and mocked external services.
 */

// Mock ONLY external services (API calls)
vi.mock("~/infrastructure/http/fetch-client", () => ({
  httpRequest: vi.fn(),
}));

// Use real implementations for:
// - validateLoginData (auth-service)
// - createErrorResponse, isNextRedirect (error-service)
// - setAuthToken (cookie-storage)
// - loginAction (action)

// Import real implementations
import { loginAction } from "~/actions/auth/login";
import { httpRequest } from "~/infrastructure/http/fetch-client";
import { redirect } from "next/navigation";

describe("Authentication Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should complete full login flow with valid credentials", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    formData.append("rememberMe", "on");

    const authResponse = {
      token: "jwt-token-123",
      user: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      },
    };

    vi.mocked(httpRequest).mockResolvedValue(authResponse);
    vi.mocked(redirect).mockImplementation((path: string) => {
      const error = new Error(`NEXT_REDIRECT:${path}`);
      (error as any).digest = `NEXT_REDIRECT;${path}`;
      throw error;
    });

    // Act
    try {
      await loginAction(null, formData);
    } catch (error: any) {
      // Assert - Should redirect
      expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
    }

    // Assert - Verify API was called correctly
    expect(httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/auth/login",
        method: "post",
        body: {
          email: "test@example.com",
          password: "password123",
        },
      })
    );
  });

  it("TC002: should handle validation errors without calling API", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("email", "invalid-email"); // Invalid email
    formData.append("password", "password123");

    // Act
    const result = await loginAction(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("Please enter a valid email address");
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("TC003: should handle API errors gracefully", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "wrongpassword");

    const apiError = {
      response: {
        data: {
          error: "Invalid credentials",
        },
      },
    };

    vi.mocked(httpRequest).mockRejectedValue(apiError);

    // Act
    const result = await loginAction(null, formData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid credentials");
  });
});


import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/infrastructure/external", () => ({
  authGithubLogin: vi.fn(),
  authGoogleLogin: vi.fn(),
}));

vi.mock("~/infrastructure/storage/cookie-storage", () => ({
  setAuthToken: vi.fn(),
}));

vi.mock("~/services/error-service", () => ({
  createErrorResponse: vi.fn(),
  isNextRedirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    const error = new Error(`NEXT_REDIRECT:${path}`);
    (error as any).digest = `NEXT_REDIRECT;${path}`;
    throw error;
  }),
}));

// Import after mocks
import { githubAuthAction, googleAuthAction } from "~/actions/auth/oauth";
import { authGithubLogin, authGoogleLogin } from "~/infrastructure/external";
import { setAuthToken } from "~/infrastructure/storage/cookie-storage";
import { createErrorResponse, isNextRedirect } from "~/services/error-service";
import { redirect } from "next/navigation";

describe("oauth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("githubAuthAction", () => {
    it("TC001: should successfully authenticate with GitHub code", async () => {
      // Arrange
      const code = "github-code-123";
      const authResponse = {
        token: "jwt-token-123",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
      };

      vi.mocked(authGithubLogin).mockResolvedValue(authResponse);
      vi.mocked(setAuthToken).mockResolvedValue(undefined);
      vi.mocked(isNextRedirect).mockReturnValue(true);

      // Act
      try {
        await githubAuthAction(code);
      } catch (error: any) {
        expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
      }

      // Assert
      expect(authGithubLogin).toHaveBeenCalledWith(code);
      expect(setAuthToken).toHaveBeenCalledWith(authResponse.token, false);
      expect(redirect).toHaveBeenCalledWith("/dashboard");
    });

    it("TC002: should return error when API call fails", async () => {
      // Arrange
      const code = "invalid-code";
      const apiError = new Error("Invalid GitHub code");

      vi.mocked(authGithubLogin).mockRejectedValue(apiError);
      vi.mocked(isNextRedirect).mockReturnValue(false);
      vi.mocked(createErrorResponse).mockReturnValue({
        success: false,
        error: "GitHub authentication failed. Please try again.",
      });

      // Act
      const result = await githubAuthAction(code);

      // Assert
      expect(result).toEqual({
        success: false,
        error: "GitHub authentication failed. Please try again.",
      });
      expect(createErrorResponse).toHaveBeenCalledWith(
        apiError,
        "GitHub authentication failed. Please try again."
      );
      expect(setAuthToken).not.toHaveBeenCalled();
    });

    it("TC003: should re-throw Next.js redirect errors", async () => {
      // Arrange
      const code = "github-code-123";
      const authResponse = {
        token: "jwt-token-123",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
      };

      vi.mocked(authGithubLogin).mockResolvedValue(authResponse);
      vi.mocked(setAuthToken).mockResolvedValue(undefined);
      vi.mocked(isNextRedirect).mockReturnValue(true);

      // Act & Assert
      try {
        await githubAuthAction(code);
        expect.fail("Should have thrown redirect error");
      } catch (error: any) {
        expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
      }
    });
  });

  describe("googleAuthAction", () => {
    it("TC004: should successfully authenticate with Google credential", async () => {
      // Arrange
      const credentialResponse = { credential: "google-token-123" };
      const authResponse = {
        token: "jwt-token-123",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
      };

      vi.mocked(authGoogleLogin).mockResolvedValue(authResponse);
      vi.mocked(setAuthToken).mockResolvedValue(undefined);
      vi.mocked(isNextRedirect).mockReturnValue(true);

      // Act
      try {
        await googleAuthAction(credentialResponse);
      } catch (error: any) {
        expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
      }

      // Assert
      expect(authGoogleLogin).toHaveBeenCalledWith(credentialResponse.credential);
      expect(setAuthToken).toHaveBeenCalledWith(authResponse.token, false);
      expect(redirect).toHaveBeenCalledWith("/dashboard");
    });

    it("TC005: should return error when API call fails", async () => {
      // Arrange
      const credentialResponse = { credential: "invalid-token" };
      const apiError = new Error("Invalid Google token");

      vi.mocked(authGoogleLogin).mockRejectedValue(apiError);
      vi.mocked(isNextRedirect).mockReturnValue(false);
      vi.mocked(createErrorResponse).mockReturnValue({
        success: false,
        error: "Google authentication failed. Please try again.",
      });

      // Act
      const result = await googleAuthAction(credentialResponse);

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Google authentication failed. Please try again.",
      });
      expect(createErrorResponse).toHaveBeenCalledWith(
        apiError,
        "Google authentication failed. Please try again."
      );
      expect(setAuthToken).not.toHaveBeenCalled();
    });

    it("TC006: should always set rememberMe to false for OAuth", async () => {
      // Arrange
      const credentialResponse = { credential: "google-token-123" };
      const authResponse = {
        token: "jwt-token-123",
        user: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
      };

      vi.mocked(authGoogleLogin).mockResolvedValue(authResponse);
      vi.mocked(setAuthToken).mockResolvedValue(undefined);
      vi.mocked(isNextRedirect).mockReturnValue(true);

      // Act
      try {
        await googleAuthAction(credentialResponse);
      } catch (error: any) {
        expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
      }

      // Assert
      expect(setAuthToken).toHaveBeenCalledWith(authResponse.token, false);
    });
  });
});


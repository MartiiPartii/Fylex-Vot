import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/utils/authentication", () => ({
  getCookieStore: vi.fn(),
}));

vi.mock("~/services/auth-service", () => ({
  calculateTokenExpiration: vi.fn(),
  decodeTokenPayload: vi.fn(),
}));

// Import after mocks
import { setAuthToken, removeAuthToken } from "~/infrastructure/storage/cookie-storage";
import { getCookieStore } from "~/utils/authentication";
import { calculateTokenExpiration, decodeTokenPayload } from "~/services/auth-service";

describe("cookie-storage", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    // Restore original NODE_ENV
    if (originalEnv !== undefined) {
      vi.stubEnv("NODE_ENV", originalEnv);
    } else {
      // Restore to test (default test environment)
      vi.stubEnv("NODE_ENV", "test");
    }
  });

  describe("setAuthToken", () => {
    it("TC001: should set token with expiration config from rememberMe", async () => {
      // Arrange
      const token = "jwt-token-123";
      const rememberMe = true;
      const payload = { exp: Math.floor(Date.now() / 1000) + 86400 };
      const expirationConfig = { expires: new Date(payload.exp * 1000) };
      const mockCookies = {
        set: vi.fn(),
      };

      vi.mocked(getCookieStore).mockResolvedValue(mockCookies as any);
      vi.mocked(decodeTokenPayload).mockReturnValue(payload);
      vi.mocked(calculateTokenExpiration).mockReturnValue(expirationConfig);

      // Act
      await setAuthToken(token, rememberMe);

      // Assert
      expect(getCookieStore).toHaveBeenCalled();
      expect(decodeTokenPayload).toHaveBeenCalledWith(token);
      expect(calculateTokenExpiration).toHaveBeenCalledWith(rememberMe, payload.exp);
      expect(mockCookies.set).toHaveBeenCalledWith(
        "token",
        token,
        expect.objectContaining({
          httpOnly: true,
          sameSite: "strict",
          secure: false, // NODE_ENV is test
          ...expirationConfig,
        })
      );
    });

    it("TC002: should set secure flag in production", async () => {
      // Arrange
      vi.stubEnv("NODE_ENV", "production");

      const token = "jwt-token-123";
      const rememberMe = false;
      const expirationConfig = { maxAge: 3600 };
      const mockCookies = {
        set: vi.fn(),
      };

      vi.mocked(getCookieStore).mockResolvedValue(mockCookies as any);
      vi.mocked(decodeTokenPayload).mockReturnValue(null);
      vi.mocked(calculateTokenExpiration).mockReturnValue(expirationConfig);

      // Act
      await setAuthToken(token, rememberMe);

      // Assert
      expect(mockCookies.set).toHaveBeenCalledWith(
        "token",
        token,
        expect.objectContaining({
          secure: true,
        })
      );
    });

    it("TC003: should handle token without expiration", async () => {
      // Arrange
      const token = "jwt-token-123";
      const rememberMe = false;
      const expirationConfig = { maxAge: 3600 };
      const mockCookies = {
        set: vi.fn(),
      };

      vi.mocked(getCookieStore).mockResolvedValue(mockCookies as any);
      vi.mocked(decodeTokenPayload).mockReturnValue(null);
      vi.mocked(calculateTokenExpiration).mockReturnValue(expirationConfig);

      // Act
      await setAuthToken(token, rememberMe);

      // Assert
      expect(calculateTokenExpiration).toHaveBeenCalledWith(rememberMe, undefined);
    });
  });

  describe("removeAuthToken", () => {
    it("TC004: should delete token from cookies", async () => {
      // Arrange
      const mockCookies = {
        delete: vi.fn(),
      };

      vi.mocked(getCookieStore).mockResolvedValue(mockCookies as any);

      // Act
      await removeAuthToken();

      // Assert
      expect(getCookieStore).toHaveBeenCalled();
      expect(mockCookies.delete).toHaveBeenCalledWith("token");
    });
  });
});


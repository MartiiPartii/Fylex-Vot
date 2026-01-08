import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Import after mocks
import { getCookieStore, getToken, isAuthenticated } from "~/utils/authentication";
import { cookies } from "next/headers";

describe("authentication utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCookieStore", () => {
    it("TC001: should return cookie store from next/headers", async () => {
      // Arrange
      const mockCookies = {
        get: vi.fn(),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookies as any);

      // Act
      const result = await getCookieStore();

      // Assert
      expect(result).toBe(mockCookies);
      expect(cookies).toHaveBeenCalled();
    });
  });

  describe("getToken", () => {
    it("TC002: should return token value from cookies", async () => {
      // Arrange
      const token = "jwt-token-123";
      const mockCookies = {
        get: vi.fn(() => ({ value: token })),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookies as any);

      // Act
      const result = await getToken();

      // Assert
      expect(result).toBe(token);
      expect(mockCookies.get).toHaveBeenCalledWith("token");
    });

    it("TC003: should return null when token cookie is missing", async () => {
      // Arrange
      const mockCookies = {
        get: vi.fn(() => undefined),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookies as any);

      // Act
      const result = await getToken();

      // Assert
      expect(result).toBe(null);
    });

    it("TC004: should return null when token cookie has no value", async () => {
      // Arrange
      const mockCookies = {
        get: vi.fn(() => ({ value: "" })),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookies as any);

      // Act
      const result = await getToken();

      // Assert
      expect(result).toBe(null);
    });
  });

  describe("isAuthenticated", () => {
    it("TC005: should return true when token exists", async () => {
      // Arrange
      const token = "jwt-token-123";
      const mockCookies = {
        get: vi.fn(() => ({ value: token })),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookies as any);

      // Act
      const result = await isAuthenticated();

      // Assert
      expect(result).toBe(true);
    });

    it("TC006: should return false when token is missing", async () => {
      // Arrange
      const mockCookies = {
        get: vi.fn(() => undefined),
      };

      vi.mocked(cookies).mockResolvedValue(mockCookies as any);

      // Act
      const result = await isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });
  });
});


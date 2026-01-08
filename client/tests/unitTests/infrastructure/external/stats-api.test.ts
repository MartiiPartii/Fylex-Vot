import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/infrastructure/http/fetch-client", () => ({
  httpRequest: vi.fn(),
}));

vi.mock("~/utils/authentication", () => ({
  getToken: vi.fn(),
}));

vi.mock("~/services/auth-service", () => ({
  decodeTokenPayload: vi.fn(),
}));

vi.mock("next/cache", () => ({
  unstable_cache: vi.fn((fn: any) => fn),
}));

// Import after mocks
import { statsGet } from "~/infrastructure/external/stats-api";
import { httpRequest } from "~/infrastructure/http/fetch-client";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { unstable_cache } from "next/cache";
import { Stats } from "~/types";

describe("stats-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("statsGet", () => {
    it("TC001: should fetch stats for authenticated user and use userId in cache key", async () => {
      // Arrange
      const token = "jwt-token";
      const payload = { id: "user-123" };
      const expectedStats: Stats = {
        totalSkans: 5,
        totalSkansPersentage: 80,
        threadsDetected: 1,
        threadsDetectedPersentage: 20,
        cleanDocuments: 4,
        cleanDocumentsPersentage: 80,
        avgScanTime: 1200,
        avgScanTimePersentage: 75,
      };

      vi.mocked(getToken).mockResolvedValue(token);
      vi.mocked(decodeTokenPayload).mockReturnValue(payload);
      vi.mocked(httpRequest).mockResolvedValue(expectedStats);

      // Act
      const result = await statsGet();

      // Assert
      expect(result).toEqual(expectedStats);
      expect(getToken).toHaveBeenCalled();
      expect(decodeTokenPayload).toHaveBeenCalledWith(token);

      expect(httpRequest).toHaveBeenCalledWith({
        url: "/document/an",
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        token,
      });

      expect(vi.mocked(unstable_cache)).toHaveBeenCalledWith(
        expect.any(Function),
        [`stats-${payload.id}`],
        expect.objectContaining({
          tags: [`stats-${payload.id}`],
          revalidate: 300,
        })
      );
    });

    it("TC002: should fetch stats as anonymous when token is missing", async () => {
      // Arrange
      const expectedStats: Stats = {
        totalSkans: 0,
        totalSkansPersentage: 0,
        threadsDetected: 0,
        threadsDetectedPersentage: 0,
        cleanDocuments: 0,
        cleanDocumentsPersentage: 0,
        avgScanTime: 0,
        avgScanTimePersentage: 0,
      };

      vi.mocked(getToken).mockResolvedValue(null);
      vi.mocked(decodeTokenPayload).mockReturnValue(null);
      vi.mocked(httpRequest).mockResolvedValue(expectedStats);

      // Act
      const result = await statsGet();

      // Assert
      expect(result).toEqual(expectedStats);

      expect(httpRequest).toHaveBeenCalledWith({
        url: "/document/an",
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        token: null,
      });

      expect(vi.mocked(unstable_cache)).toHaveBeenCalledWith(
        expect.any(Function),
        ["stats-anonymous"],
        expect.objectContaining({
          tags: ["stats-anonymous"],
          revalidate: 300,
        })
      );
    });
  });
});


import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/utils/authentication", () => ({
  getToken: vi.fn(),
}));

vi.mock("~/env", () => ({
  env: {
    SERVER_BASE_URL: "http://localhost:3000",
  },
}));

// Import after mocks
import { httpRequest } from "~/infrastructure/http/fetch-client";
import { getToken } from "~/utils/authentication";

// Mock global fetch
global.fetch = vi.fn();

describe("fetch-client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should make successful GET request with token", async () => {
    // Arrange
    const mockResponse = { data: "test" };
    const token = "jwt-token";

    vi.mocked(getToken).mockResolvedValue(token);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Act
    const result = await httpRequest({
      url: "/api/test",
      method: "get",
    });

    // Assert
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/test",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      })
    );
  });

  it("TC002: should make successful POST request with JSON body", async () => {
    // Arrange
    const mockResponse = { success: true };
    const body = { name: "Test" };

    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Act
    const result = await httpRequest({
      url: "/api/test",
      method: "post",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Assert
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/test",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(body),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("TC003: should make request without token when not authenticated", async () => {
    // Arrange
    const mockResponse = { data: "test" };

    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Act
    await httpRequest({
      url: "/api/test",
      method: "get",
    });

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/test",
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.anything(),
        }),
      })
    );
  });

  it("TC004: should handle POST request with FormData body", async () => {
    // Arrange
    const mockResponse = { success: true };
    const formData = new FormData();
    formData.append("file", new File(["content"], "test.txt"));

    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Act
    await httpRequest({
      url: "/api/upload",
      method: "post",
      body: formData,
    });

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/upload",
      expect.objectContaining({
        method: "POST",
        body: formData,
      })
    );
  });

  it("TC005: should throw FetchError for non-ok response", async () => {
    // Arrange
    const errorMessage = "Invalid request";

    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: errorMessage }),
    } as Response);

    // Act & Assert
    await expect(
      httpRequest({
        url: "/api/test",
        method: "get",
      })
    ).rejects.toThrow();
  });

  it("TC006: should handle network errors", async () => {
    // Arrange
    const networkError = new Error("Network request failed");

    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(fetch).mockRejectedValue(networkError);

    // Act & Assert
    await expect(
      httpRequest({
        url: "/api/test",
        method: "get",
      })
    ).rejects.toThrow("Network request failed");
  });

  it("TC007: should use provided token instead of getting from cookies", async () => {
    // Arrange
    const mockResponse = { data: "test" };
    const providedToken = "provided-token";

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Act
    await httpRequest({
      url: "/api/test",
      method: "get",
      token: providedToken,
    });

    // Assert
    expect(getToken).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${providedToken}`,
        }),
      })
    );
  });

  it("TC008: should handle response without JSON", async () => {
    // Arrange
    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    } as unknown as Response);

    // Act
    const result = await httpRequest({
      url: "/api/test",
      method: "get",
    });

    // Assert
    expect(result).toBeNull();
  });
});


import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Integration Test: Document Upload Flow
 * 
 * Tests the complete document upload flow from action to API client,
 * using real implementations of internal layers and mocked external services.
 */

// Mock ONLY external services (API calls and Next.js cache)
vi.mock("~/infrastructure/http/fetch-client", () => ({
  httpRequest: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    const error = new Error(`NEXT_REDIRECT:${path}`);
    (error as any).digest = `NEXT_REDIRECT;${path}`;
    throw error;
  }),
}));

// Use real implementations for:
// - encodeString (base64 utils)
// - decodeTokenPayload (auth-service)
// - getToken (authentication utils)
// - uploadDocumentAction (action)

// Import real implementations
import { uploadDocumentAction } from "~/actions/document/upload";
import { httpRequest } from "~/infrastructure/http/fetch-client";
import { revalidateTag, revalidatePath } from "next/cache";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";

// Mock authentication utils
vi.mock("~/utils/authentication", () => ({
  getToken: vi.fn(),
}));

vi.mock("~/services/auth-service", () => ({
  decodeTokenPayload: vi.fn(),
}));

describe("Document Upload Flow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should complete full document upload flow", async () => {
    // Arrange
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    const document = {
      id: "doc-123",
      name: "test.pdf",
      uploadDate: "2024-01-01T00:00:00Z",
      status: "clean" as const,
      securityPercentage: 85.5,
    };
    const token = "jwt-token";
    const payload = { id: "user-123" };

    vi.mocked(httpRequest).mockResolvedValue(document);
    vi.mocked(getToken).mockResolvedValue(token);
    vi.mocked(decodeTokenPayload).mockReturnValue(payload);

    // Act
    try {
      await uploadDocumentAction(file);
    } catch (error: any) {
      // Assert - Should redirect
      expect(error.digest).toContain("NEXT_REDIRECT;/document/");
    }

    // Assert - Verify API was called
    expect(httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/document",
        method: "post",
      })
    );

    // Assert - Verify cache was revalidated
    expect(revalidateTag).toHaveBeenCalledWith("documents-user-123");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("TC002: should handle missing file error", async () => {
    // Arrange
    const file = null;

    // Act
    const result = await uploadDocumentAction(file);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("No file provided");
    expect(httpRequest).not.toHaveBeenCalled();
  });

  it("TC003: should handle API upload errors", async () => {
    // Arrange
    const file = new File(["content"], "test.pdf");
    const apiError = {
      response: {
        data: {
          error: "File too large",
        },
      },
    };

    vi.mocked(httpRequest).mockRejectedValue(apiError);

    // Act
    const result = await uploadDocumentAction(file);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("File too large");
  });
});


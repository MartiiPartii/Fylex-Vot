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
import { documentList, documentGet, documentUpload } from "~/infrastructure/external/document-api";
import { httpRequest } from "~/infrastructure/http/fetch-client";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { unstable_cache } from "next/cache";
import { Document } from "~/types";

describe("document-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("documentList", () => {
    it("TC001: should fetch documents for authenticated user and use userId in cache key", async () => {
      // Arrange
      const token = "jwt-token";
      const payload = { id: "user-123" };
      const expectedDocuments = [{ id: "doc-1" }, { id: "doc-2" }];

      vi.mocked(getToken).mockResolvedValue(token);
      vi.mocked(decodeTokenPayload).mockReturnValue(payload);
      vi.mocked(httpRequest).mockResolvedValue(expectedDocuments);

      // Act
      const result = await documentList();

      // Assert
      expect(result).toEqual(expectedDocuments);

      // http client is called with token so cached function can reuse it
      expect(httpRequest).toHaveBeenCalledWith({
        url: "/document",
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        token,
      });

      // cache key and tags are user-specific
      expect(vi.mocked(unstable_cache)).toHaveBeenCalledWith(
        expect.any(Function),
        [`documents-list-${payload.id}`],
        expect.objectContaining({
          tags: [`documents-${payload.id}`],
          revalidate: 300,
        })
      );
    });

    it("TC002: should fetch documents as anonymous when token is missing", async () => {
      // Arrange
      const expectedDocuments: Document[] = [];

      vi.mocked(getToken).mockResolvedValue(null);
      vi.mocked(decodeTokenPayload).mockReturnValue(null);
      vi.mocked(httpRequest).mockResolvedValue(expectedDocuments);

      // Act
      const result = await documentList();

      // Assert
      expect(result).toEqual(expectedDocuments);

      expect(httpRequest).toHaveBeenCalledWith({
        url: "/document",
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        token: null,
      });

      expect(vi.mocked(unstable_cache)).toHaveBeenCalledWith(
        expect.any(Function),
        ["documents-list-anonymous"],
        expect.objectContaining({
          tags: ["documents-anonymous"],
          revalidate: 300,
        })
      );
    });
  });

  describe("documentGet", () => {
    it("TC003: should fetch a document by ID and use userId in cache key", async () => {
      // Arrange
      const id = "doc-123";
      const token = "jwt-token";
      const payload = { id: "user-123" };
      const expectedDocument = { id: "doc-123", name: "test.pdf" };

      vi.mocked(getToken).mockResolvedValue(token);
      vi.mocked(decodeTokenPayload).mockReturnValue(payload);
      vi.mocked(httpRequest).mockResolvedValue(expectedDocument);

      // Act
      const result = await documentGet(id);

      // Assert
      expect(result).toEqual(expectedDocument);

      expect(httpRequest).toHaveBeenCalledWith({
        url: `/document/${id}`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        token,
      });

      expect(vi.mocked(unstable_cache)).toHaveBeenCalledWith(
        expect.any(Function),
        [`document-${payload.id}-${id}`],
        expect.objectContaining({
          tags: [`documents-${payload.id}`, `document-${payload.id}-${id}`],
          revalidate: 900,
        })
      );
    });
  });

  describe("documentUpload", () => {
    it("TC004: should call httpRequest with FormData containing file", async () => {
      // Arrange
      const file = new File(["content"], "test.pdf", { type: "application/pdf" });
      const expectedDocument = { id: "doc-123", name: "test.pdf" };

      vi.mocked(httpRequest).mockResolvedValue(expectedDocument);

      // Act
      const result = await documentUpload(file);

      // Assert
      expect(result).toEqual(expectedDocument);
      expect(httpRequest).toHaveBeenCalledWith({
        url: "/document",
        method: "post",
        body: expect.any(FormData),
      });
      const formData = vi.mocked(httpRequest).mock.calls[0][0].body as FormData;
      expect(formData).toBeInstanceOf(FormData);
    });
  });
});


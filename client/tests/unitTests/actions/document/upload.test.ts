import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/utils/base64", () => ({
  encodeString: vi.fn(),
}));

vi.mock("~/infrastructure/external", () => ({
  documentUpload: vi.fn(),
}));

vi.mock("~/utils/authentication", () => ({
  getToken: vi.fn(),
}));

vi.mock("~/services/auth-service", () => ({
  decodeTokenPayload: vi.fn(),
}));

vi.mock("~/services/error-service", () => ({
  createErrorResponse: vi.fn(),
  isNextRedirect: vi.fn(),
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

// Import after mocks
import { uploadDocumentAction } from "~/actions/document/upload";
import { encodeString } from "~/utils/base64";
import { documentUpload } from "~/infrastructure/external";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { createErrorResponse, isNextRedirect } from "~/services/error-service";
import { revalidateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

describe("uploadDocumentAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should successfully upload document and redirect", async () => {
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
    const encodedId = "encoded-doc-id";

    vi.mocked(documentUpload).mockResolvedValue(document);
    vi.mocked(getToken).mockResolvedValue(token);
    vi.mocked(decodeTokenPayload).mockReturnValue(payload);
    vi.mocked(encodeString).mockReturnValue(encodedId);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    // Act
    try {
      await uploadDocumentAction(file);
    } catch (error: any) {
      expect(error.digest).toBe(`NEXT_REDIRECT;/document/${encodedId}`);
    }

    // Assert
    expect(documentUpload).toHaveBeenCalledWith(file);
    expect(getToken).toHaveBeenCalled();
    expect(decodeTokenPayload).toHaveBeenCalledWith(token);
    expect(revalidateTag).toHaveBeenCalledWith("documents-user-123");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(encodeString).toHaveBeenCalledWith(JSON.stringify(document));
    expect(redirect).toHaveBeenCalledWith(`/document/${encodedId}`);
  });

  it("TC002: should return error when no file provided", async () => {
    // Arrange
    const file = null;

    vi.mocked(createErrorResponse).mockReturnValue({
      success: false,
      error: "Please select a file to upload.",
    });

    // Act
    const result = await uploadDocumentAction(file);

    // Assert
    expect(result).toEqual({
      success: false,
      error: "Please select a file to upload.",
    });
    expect(createErrorResponse).toHaveBeenCalledWith(
      expect.any(Error),
      "Please select a file to upload."
    );
    expect(documentUpload).not.toHaveBeenCalled();
  });

  it("TC003: should return error when API call fails", async () => {
    // Arrange
    const file = new File(["content"], "test.pdf");
    const apiError = new Error("Upload failed");

    vi.mocked(documentUpload).mockRejectedValue(apiError);
    vi.mocked(isNextRedirect).mockReturnValue(false);
    vi.mocked(createErrorResponse).mockReturnValue({
      success: false,
      error: "Failed to upload document. Please try again.",
    });

    // Act
    const result = await uploadDocumentAction(file);

    // Assert
    expect(result).toEqual({
      success: false,
      error: "Failed to upload document. Please try again.",
    });
    expect(createErrorResponse).toHaveBeenCalledWith(
      apiError,
      "Failed to upload document. Please try again."
    );
  });

  it("TC004: should redirect to dashboard if encoding fails", async () => {
    // Arrange
    const file = new File(["content"], "test.pdf");
    const document = {
      id: "doc-123",
      name: "test.pdf",
      uploadDate: "2024-01-01T00:00:00Z",
      status: "clean" as const,
      securityPercentage: 85.5,
    };
    const token = "jwt-token";
    const payload = { id: "user-123" };

    vi.mocked(documentUpload).mockResolvedValue(document);
    vi.mocked(getToken).mockResolvedValue(token);
    vi.mocked(decodeTokenPayload).mockReturnValue(payload);
    vi.mocked(encodeString).mockImplementation(() => {
      throw new Error("Encoding failed");
    });
    // The redirect will be thrown, so isNextRedirect should return false for the encoding error
    // but true for the redirect itself
    vi.mocked(isNextRedirect).mockImplementation((error: any) => {
      return error?.digest?.startsWith("NEXT_REDIRECT") ?? false;
    });

    // Act
    try {
      await uploadDocumentAction(file);
      expect.fail("Should have thrown redirect error");
    } catch (error: any) {
      // Assert - should redirect to dashboard
      expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
    }

    // Assert
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("TC005: should use anonymous userId when token is missing", async () => {
    // Arrange
    const file = new File(["content"], "test.pdf");
    const document = {
      id: "doc-123",
      name: "test.pdf",
      uploadDate: "2024-01-01T00:00:00Z",
      status: "clean" as const,
      securityPercentage: 85.5,
    };
    const encodedId = "encoded-doc-id";

    vi.mocked(documentUpload).mockResolvedValue(document);
    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(decodeTokenPayload).mockReturnValue(null);
    vi.mocked(encodeString).mockReturnValue(encodedId);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    // Act
    try {
      await uploadDocumentAction(file);
    } catch (error: any) {
      expect(error.digest).toBe(`NEXT_REDIRECT;/document/${encodedId}`);
    }

    // Assert
    expect(revalidateTag).toHaveBeenCalledWith("documents-anonymous");
  });
});


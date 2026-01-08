import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/infrastructure/external", () => ({
  authUploadPicture: vi.fn(),
}));

vi.mock("~/utils/authentication", () => ({
  getToken: vi.fn(),
}));

vi.mock("~/services/auth-service", () => ({
  decodeTokenPayload: vi.fn(),
}));

vi.mock("~/services/error-service", () => ({
  createErrorResponse: vi.fn(),
  createSuccessResponse: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

// Import after mocks
import { uploadPictureAction } from "~/actions/profile/upload-picture";
import { authUploadPicture } from "~/infrastructure/external";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { createErrorResponse, createSuccessResponse } from "~/services/error-service";
import { revalidateTag, revalidatePath } from "next/cache";

describe("uploadPictureAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should successfully upload picture and revalidate cache", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("picture", new File(["content"], "pic.jpg"));
    const token = "jwt-token";
    const payload = { id: "user-123" };

    vi.mocked(authUploadPicture).mockResolvedValue(undefined);
    vi.mocked(getToken).mockResolvedValue(token);
    vi.mocked(decodeTokenPayload).mockReturnValue(payload);
    vi.mocked(createSuccessResponse).mockReturnValue({
      success: true,
      data: undefined,
    });

    // Act
    const result = await uploadPictureAction(null, formData);

    // Assert
    expect(authUploadPicture).toHaveBeenCalledWith(formData);
    expect(getToken).toHaveBeenCalled();
    expect(decodeTokenPayload).toHaveBeenCalledWith(token);
    expect(revalidateTag).toHaveBeenCalledWith("user-profile-user-123");
    expect(revalidatePath).toHaveBeenCalledWith("/profile");
    expect(result).toEqual({
      success: true,
      data: undefined,
    });
  });

  it("TC002: should return error when API call fails", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("picture", new File(["content"], "pic.jpg"));
    const apiError = new Error("Upload failed");

    vi.mocked(authUploadPicture).mockRejectedValue(apiError);
    vi.mocked(createErrorResponse).mockReturnValue({
      success: false,
      error: "Failed to upload picture. Please try again.",
    });

    // Act
    const result = await uploadPictureAction(null, formData);

    // Assert
    expect(result).toEqual({
      success: false,
      error: "Failed to upload picture. Please try again.",
    });
    expect(createErrorResponse).toHaveBeenCalledWith(
      apiError,
      "Failed to upload picture. Please try again."
    );
  });

  it("TC003: should use anonymous userId when token is missing", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("picture", new File(["content"], "pic.jpg"));

    vi.mocked(authUploadPicture).mockResolvedValue(undefined);
    vi.mocked(getToken).mockResolvedValue(null);
    vi.mocked(decodeTokenPayload).mockReturnValue(null);
    vi.mocked(createSuccessResponse).mockReturnValue({
      success: true,
      data: undefined,
    });

    // Act
    await uploadPictureAction(null, formData);

    // Assert
    expect(revalidateTag).toHaveBeenCalledWith("user-profile-anonymous");
  });
});


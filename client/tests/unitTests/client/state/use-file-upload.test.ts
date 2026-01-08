import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

// Mock all dependencies BEFORE imports
vi.mock("~/actions/document", () => ({
  uploadDocumentAction: vi.fn(),
}));

vi.mock("~/services/error-service", () => ({
  isNextRedirect: vi.fn(),
}));

// Import after mocks
import { useFileUpload } from "~/client/state/UploadFile/use-file-upload";
import { uploadDocumentAction } from "~/actions/document";
import { isNextRedirect } from "~/services/error-service";

describe("useFileUpload", () => {
  // Track unhandled rejections for redirect errors
  const redirectRejections: any[] = [];
  let rejectionHandler: ((reason: any) => void) | null = null;

  beforeEach(() => {
    // Set test environment variable
    process.env.NEXT_PUBLIC_MAX_FILE_SIZE = '5'; // 5MB for testing
    vi.clearAllMocks();
    redirectRejections.length = 0;
    
    // Set up handler to catch expected redirect rejections
    rejectionHandler = (reason: any) => {
      if (reason?.digest?.startsWith("NEXT_REDIRECT")) {
        redirectRejections.push(reason);
        // Suppress the error for expected redirects
      }
    };
    process.prependListener("unhandledRejection", rejectionHandler);
  });

  afterEach(() => {
    // Cleanup handler
    if (rejectionHandler) {
      process.removeListener("unhandledRejection", rejectionHandler);
      rejectionHandler = null;
    }
    redirectRejections.length = 0;
  });

  it("TC001: should initialize with loading false and no error", () => {
    // Act
    const { result } = renderHook(() => useFileUpload());

    // Assert
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("TC002: should set loading to true during file upload", async () => {
    // Arrange
    const file = new File(["content"], "test.pdf");
    vi.mocked(uploadDocumentAction).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                success: true,
                data: {
                  id: "doc-123",
                  name: "test.pdf",
                  uploadDate: "2024-01-01T00:00:00Z",
                  status: "clean" as const,
                  securityPercentage: 85.5,
                },
              }),
            100
          )
        )
    );

    const { result } = renderHook(() => useFileUpload());

    // Act
    act(() => {
      result.current.onDropAccepted([file]);
    });

    // Assert
    expect(result.current.loading).toBe(true);

    // Wait for upload to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("TC003: should set error when upload fails", async () => {
    // Arrange
    const file = new File(["content"], "test.pdf");
    vi.mocked(uploadDocumentAction).mockResolvedValue({
      success: false,
      error: "Upload failed",
    });

    const { result } = renderHook(() => useFileUpload());

    // Act
    await act(async () => {
      await result.current.onDropAccepted([file]);
    });

    // Assert
    await waitFor(() => {
      expect(result.current.error).toBe("Upload failed");
      expect(result.current.loading).toBe(false);
    });
  });

  it("TC004: should set error for file too large rejection", () => {
    // Arrange
    const fileRejections = [
      {
        errors: [{ code: "file-too-large" }],
      },
    ];

    const { result } = renderHook(() => useFileUpload());

    // Act
    act(() => {
      result.current.onDropRejected(fileRejections);
    });

    // Assert
    expect(result.current.error).toBe(`Your file exceeds the 5 MB limit.`);
  });

  it("TC005: should set generic error for other rejection types", () => {
    // Arrange
    const fileRejections = [
      {
        errors: [{ code: "file-invalid-type" }],
      },
    ];

    const { result } = renderHook(() => useFileUpload());

    // Act
    act(() => {
      result.current.onDropRejected(fileRejections);
    });

    // Assert
    expect(result.current.error).toBe("Something went wrong. Please try again.");
  });

  it("TC006: should re-throw Next.js redirect errors", async () => {
    // Arrange
    const file = new File(["content"], "test.pdf");
    const redirectError = {
      digest: "NEXT_REDIRECT;/dashboard",
    };

    vi.mocked(uploadDocumentAction).mockRejectedValue(redirectError);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    const { result } = renderHook(() => useFileUpload());

    // Act
    // onDropAccepted calls sendFile which is async but not awaited
    // The redirect error will be re-thrown and become an unhandled rejection
    // We test that the error is not caught and set as a regular error
    act(() => {
      result.current.onDropAccepted([file]);
    });

    // Wait for the async operation to complete
    await waitFor(() => {
      // The redirect should be re-thrown, so error should not be set
      // (the error would only be set if it was caught as a regular error)
      expect(result.current.error).toBe(null);
    }, { timeout: 100 });

    // Wait for the rejection to be caught by the global handler
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Assert that the redirect error was thrown (this is expected behavior)
    // In production, Next.js would handle this redirect properly
    // The global handler in beforeEach should have caught it
    const caughtRejection = redirectRejections.find(
      (r) => r.digest === "NEXT_REDIRECT;/dashboard"
    );
    expect(caughtRejection).not.toBeUndefined();
    expect(caughtRejection?.digest).toBe("NEXT_REDIRECT;/dashboard");
  });

  it("TC007: should clear error when new file is accepted", async () => {
    // Arrange
    const file1 = new File(["content"], "test1.pdf");
    const file2 = new File(["content"], "test2.pdf");

    vi.mocked(uploadDocumentAction)
      .mockResolvedValueOnce({
        success: false,
        error: "First error",
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          id: "doc-123",
          name: "test.pdf",
          uploadDate: "2024-01-01T00:00:00Z",
          status: "clean" as const,
          securityPercentage: 85.5,
        },
      });

    const { result } = renderHook(() => useFileUpload());

    // Act - First upload with error
    act(() => {
      result.current.onDropAccepted([file1]);
    });

    await waitFor(() => {
      expect(result.current.error).toBe("First error");
    });

    // Act - Second upload should clear error
    // Note: In real usage, successful uploads redirect, but for this test
    // we mock a success response without redirect to test error clearing
    act(() => {
      result.current.onDropAccepted([file2]);
    });

    // Assert - Error should be cleared when new file is accepted
    await waitFor(() => {
      expect(result.current.error).toBe(null);
    }, { timeout: 100 });
  });

  it("TC008: should allow manual error setting", () => {
    // Arrange
    const { result } = renderHook(() => useFileUpload());

    // Act
    act(() => {
      result.current.setError("Custom error");
    });

    // Assert
    expect(result.current.error).toBe("Custom error");
  });
});


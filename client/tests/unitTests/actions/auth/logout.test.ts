import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/services/auth-service", () => ({
  logoutService: vi.fn(),
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
import { logoutAction } from "~/actions/auth/logout";
import { logoutService } from "~/services/auth-service";
import { createErrorResponse, isNextRedirect } from "~/services/error-service";
import { redirect } from "next/navigation";

describe("logoutAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: calls logoutService and redirects to login", async () => {
    // Arrange
    vi.mocked(logoutService).mockResolvedValue(undefined);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    // Act
    try {
      await logoutAction();
      expect.fail("Should have thrown redirect error");
    } catch (error: any) {
      // redirect from logoutAction should be re-thrown
      expect(error.digest).toBe("NEXT_REDIRECT;/login");
    }

    // Assert
    expect(logoutService).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("TC002: returns error response when logoutService fails with non-redirect error", async () => {
    // Arrange
    const serviceError = new Error("Failed to logout");

    vi.mocked(logoutService).mockRejectedValue(serviceError);
    vi.mocked(isNextRedirect).mockReturnValue(false);
    vi.mocked(createErrorResponse).mockReturnValue({
      success: false,
      error: "Logout failed. Please try again.",
    });

    // Act
    const result = await logoutAction();

    // Assert
    expect(result).toEqual({
      success: false,
      error: "Logout failed. Please try again.",
    });
    expect(createErrorResponse).toHaveBeenCalledWith(
      serviceError,
      "Logout failed. Please try again."
    );
  });

  it("TC003: re-throws Next.js redirect errors from logoutService", async () => {
    // Arrange - simulate redirect thrown by underlying service
    const redirectError = new Error("NEXT_REDIRECT;/login");
    (redirectError as any).digest = "NEXT_REDIRECT;/login";

    vi.mocked(logoutService).mockRejectedValue(redirectError);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    // Act & Assert
    try {
      await logoutAction();
      expect.fail("Should have thrown redirect error");
    } catch (error: any) {
      expect(error.digest).toBe("NEXT_REDIRECT;/login");
    }
  });
});


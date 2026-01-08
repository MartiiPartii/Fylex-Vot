import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/services/auth-service", () => ({
  validateLoginData: vi.fn(),
}));

vi.mock("~/infrastructure/external", () => ({
  authLogin: vi.fn(),
}));

vi.mock("~/infrastructure/storage/cookie-storage", () => ({
  setAuthToken: vi.fn(),
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
import { loginAction } from "~/actions/auth/login";
import { validateLoginData } from "~/services/auth-service";
import { authLogin } from "~/infrastructure/external";
import { setAuthToken } from "~/infrastructure/storage/cookie-storage";
import { createErrorResponse, isNextRedirect } from "~/services/error-service";
import { redirect } from "next/navigation";

describe("loginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should successfully login with valid credentials", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    formData.append("rememberMe", "on");

    const validatedData = {
      email: "test@example.com",
      password: "password123",
      rememberMe: "on",
    };

    const authResponse = {
      token: "jwt-token-123",
      user: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      },
    };

    vi.mocked(validateLoginData).mockReturnValue({
      success: true,
      data: validatedData,
    });
    vi.mocked(authLogin).mockResolvedValue(authResponse);
    vi.mocked(setAuthToken).mockResolvedValue(undefined);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    // Act
    try {
      await loginAction(null, formData);
    } catch (error: any) {
      // Assert - should redirect
      expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
    }

    // Assert
    expect(validateLoginData).toHaveBeenCalledWith(formData);
    expect(authLogin).toHaveBeenCalledWith({
      email: validatedData.email,
      password: validatedData.password,
    });
    expect(setAuthToken).toHaveBeenCalledWith(authResponse.token, true);
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("TC002: should return error for invalid form data", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("email", "invalid-email");

    vi.mocked(validateLoginData).mockReturnValue({
      success: false,
      error: "Please enter a valid email address",
    });
    vi.mocked(createErrorResponse).mockReturnValue({
      success: false,
      error: "Please enter a valid email address",
    });

    // Act
    const result = await loginAction(null, formData);

    // Assert
    expect(result).toEqual({
      success: false,
      error: "Please enter a valid email address",
    });
    expect(validateLoginData).toHaveBeenCalledWith(formData);
    expect(authLogin).not.toHaveBeenCalled();
    expect(setAuthToken).not.toHaveBeenCalled();
  });

  it("TC003: should set rememberMe to false when not provided", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    const validatedData = {
      email: "test@example.com",
      password: "password123",
    };

    const authResponse = {
      token: "jwt-token-123",
      user: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      },
    };

    vi.mocked(validateLoginData).mockReturnValue({
      success: true,
      data: validatedData,
    });
    vi.mocked(authLogin).mockResolvedValue(authResponse);
    vi.mocked(setAuthToken).mockResolvedValue(undefined);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    // Act
    try {
      await loginAction(null, formData);
    } catch (error: any) {
      expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
    }

    // Assert
    expect(setAuthToken).toHaveBeenCalledWith(authResponse.token, false);
  });

  it("TC004: should return error when API call fails", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    const validatedData = {
      email: "test@example.com",
      password: "password123",
      rememberMe: "on",
    };

    const apiError = new Error("Invalid credentials");

    vi.mocked(validateLoginData).mockReturnValue({
      success: true,
      data: validatedData,
    });
    vi.mocked(authLogin).mockRejectedValue(apiError);
    vi.mocked(isNextRedirect).mockReturnValue(false);
    vi.mocked(createErrorResponse).mockReturnValue({
      success: false,
      error: "Login failed. Please check your credentials and try again.",
    });

    // Act
    const result = await loginAction(null, formData);

    // Assert
    expect(result).toEqual({
      success: false,
      error: "Login failed. Please check your credentials and try again.",
    });
    expect(createErrorResponse).toHaveBeenCalledWith(
      apiError,
      "Login failed. Please check your credentials and try again."
    );
    expect(setAuthToken).not.toHaveBeenCalled();
  });

  it("TC005: should re-throw Next.js redirect errors", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    const validatedData = {
      email: "test@example.com",
      password: "password123",
    };

    const authResponse = {
      token: "jwt-token-123",
      user: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      },
    };
    const redirectError = {
      digest: "NEXT_REDIRECT;/dashboard",
    };

    vi.mocked(validateLoginData).mockReturnValue({
      success: true,
      data: validatedData,
    });
    vi.mocked(authLogin).mockResolvedValue(authResponse);
    vi.mocked(setAuthToken).mockResolvedValue(undefined);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    // Act & Assert
    try {
      await loginAction(null, formData);
      expect.fail("Should have thrown redirect error");
    } catch (error: any) {
      expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
    }
  });
});


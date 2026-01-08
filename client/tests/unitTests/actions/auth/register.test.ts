import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/services/auth-service", () => ({
  validateRegisterData: vi.fn(),
}));

vi.mock("~/infrastructure/external", () => ({
  authRegister: vi.fn(),
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
import { registerAction } from "~/actions/auth/register";
import { validateRegisterData } from "~/services/auth-service";
import { authRegister } from "~/infrastructure/external";
import { setAuthToken } from "~/infrastructure/storage/cookie-storage";
import { createErrorResponse, isNextRedirect } from "~/services/error-service";
import { redirect } from "next/navigation";

describe("registerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should successfully register with valid data", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("firstName", "John");
    formData.append("lastName", "Doe");
    formData.append("email", "john@example.com");
    formData.append("password", "password123");
    formData.append("rememberMe", "on");

    const validatedData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      rememberMe: "on",
    };

    const authResponse = {
      token: "jwt-token-123",
      user: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
      },
    };

    vi.mocked(validateRegisterData).mockReturnValue({
      success: true,
      data: validatedData,
    });
    vi.mocked(authRegister).mockResolvedValue(authResponse);
    vi.mocked(setAuthToken).mockResolvedValue(undefined);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    // Act
    try {
      await registerAction(null, formData);
    } catch (error: any) {
      expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
    }

    // Assert
    expect(validateRegisterData).toHaveBeenCalledWith(formData);
    expect(authRegister).toHaveBeenCalledWith({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: validatedData.password,
    });
    expect(setAuthToken).toHaveBeenCalledWith(authResponse.token, true);
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("TC002: should return error for invalid form data", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("firstName", "J"); // Too short

    vi.mocked(validateRegisterData).mockReturnValue({
      success: false,
      error: "First name must be at least 2 characters",
    });
    vi.mocked(createErrorResponse).mockReturnValue({
      success: false,
      error: "First name must be at least 2 characters",
    });

    // Act
    const result = await registerAction(null, formData);

    // Assert
    expect(result).toEqual({
      success: false,
      error: "First name must be at least 2 characters",
    });
    expect(validateRegisterData).toHaveBeenCalledWith(formData);
    expect(authRegister).not.toHaveBeenCalled();
  });

  it("TC003: should return error when API call fails", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("firstName", "John");
    formData.append("lastName", "Doe");
    formData.append("email", "john@example.com");
    formData.append("password", "password123");

    const validatedData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    };

    const apiError = new Error("Email already exists");

    vi.mocked(validateRegisterData).mockReturnValue({
      success: true,
      data: validatedData,
    });
    vi.mocked(authRegister).mockRejectedValue(apiError);
    vi.mocked(isNextRedirect).mockReturnValue(false);
    vi.mocked(createErrorResponse).mockReturnValue({
      success: false,
      error: "Registration failed. Please try again.",
    });

    // Act
    const result = await registerAction(null, formData);

    // Assert
    expect(result).toEqual({
      success: false,
      error: "Registration failed. Please try again.",
    });
    expect(setAuthToken).not.toHaveBeenCalled();
  });

  it("TC004: should set rememberMe to false when not provided", async () => {
    // Arrange
    const formData = new FormData();
    formData.append("firstName", "John");
    formData.append("lastName", "Doe");
    formData.append("email", "john@example.com");
    formData.append("password", "password123");

    const validatedData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    };

    const authResponse = {
      token: "jwt-token-123",
      user: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
      },
    };

    vi.mocked(validateRegisterData).mockReturnValue({
      success: true,
      data: validatedData,
    });
    vi.mocked(authRegister).mockResolvedValue(authResponse);
    vi.mocked(setAuthToken).mockResolvedValue(undefined);
    vi.mocked(isNextRedirect).mockReturnValue(true);

    // Act
    try {
      await registerAction(null, formData);
    } catch (error: any) {
      expect(error.digest).toBe("NEXT_REDIRECT;/dashboard");
    }

    // Assert
    expect(setAuthToken).toHaveBeenCalledWith(authResponse.token, false);
  });
});


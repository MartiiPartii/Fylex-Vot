import { describe, it, expect, beforeEach } from "vitest";
import {
  validateLoginData,
  validateRegisterData,
  calculateTokenExpiration,
  decodeTokenPayload,
} from "~/services/auth-service";

describe("auth-service", () => {
  describe("validateLoginData", () => {
    it("TC001: should return success with valid login data", () => {
      // Arrange
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password123");
      formData.append("rememberMe", "on");

      // Act
      const result = validateLoginData(formData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        email: "test@example.com",
        password: "password123",
        rememberMe: "on",
      });
      expect(result.error).toBeUndefined();
    });

    it("TC002: should return error for invalid email", () => {
      // Arrange
      const formData = new FormData();
      formData.append("email", "invalid-email");
      formData.append("password", "password123");

      // Act
      const result = validateLoginData(formData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Please enter a valid email address");
      expect(result.data).toBeUndefined();
    });

    it("TC003: should return error for missing password", () => {
      // Arrange
      const formData = new FormData();
      formData.append("email", "test@example.com");

      // Act
      const result = validateLoginData(formData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Required");
      expect(result.data).toBeUndefined();
    });

    it("TC004: should handle empty form data", () => {
      // Arrange
      const formData = new FormData();

      // Act
      const result = validateLoginData(formData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Required");
    });
  });

  describe("validateRegisterData", () => {
    it("TC005: should return success with valid registration data", () => {
      // Arrange
      const formData = new FormData();
      formData.append("firstName", "John");
      formData.append("lastName", "Doe");
      formData.append("email", "john@example.com");
      formData.append("password", "password123");
      formData.append("rememberMe", "on");

      // Act
      const result = validateRegisterData(formData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        rememberMe: "on",
      });
    });

    it("TC006: should return error for short first name", () => {
      // Arrange
      const formData = new FormData();
      formData.append("firstName", "J");
      formData.append("lastName", "Doe");
      formData.append("email", "john@example.com");
      formData.append("password", "password123");

      // Act
      const result = validateRegisterData(formData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("First name must be at least 2 characters");
    });

    it("TC007: should return error for short last name", () => {
      // Arrange
      const formData = new FormData();
      formData.append("firstName", "John");
      formData.append("lastName", "D");
      formData.append("email", "john@example.com");
      formData.append("password", "password123");

      // Act
      const result = validateRegisterData(formData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Last name must be at least 2 characters");
    });

    it("TC008: should return error for invalid email", () => {
      // Arrange
      const formData = new FormData();
      formData.append("firstName", "John");
      formData.append("lastName", "Doe");
      formData.append("email", "invalid-email");
      formData.append("password", "password123");

      // Act
      const result = validateRegisterData(formData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Please enter a valid email address");
    });
  });

  describe("calculateTokenExpiration", () => {
    it("TC009: should return expires date when rememberMe is true and tokenExp is provided", () => {
      // Arrange
      const rememberMe = true;
      const tokenExp = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

      // Act
      const result = calculateTokenExpiration(rememberMe, tokenExp);

      // Assert
      expect(result.expires).toBeInstanceOf(Date);
      expect(result.expires?.getTime()).toBe(tokenExp * 1000);
      expect(result.maxAge).toBeUndefined();
    });

    it("TC010: should return maxAge 30 days when rememberMe is true and tokenExp is not provided", () => {
      // Arrange
      const rememberMe = true;
      const tokenExp = undefined;

      // Act
      const result = calculateTokenExpiration(rememberMe, tokenExp);

      // Assert
      expect(result.maxAge).toBe(30 * 24 * 60 * 60); // 30 days in seconds
      expect(result.expires).toBeUndefined();
    });

    it("TC011: should return maxAge 1 hour when rememberMe is false", () => {
      // Arrange
      const rememberMe = false;
      const tokenExp = undefined;

      // Act
      const result = calculateTokenExpiration(rememberMe, tokenExp);

      // Assert
      expect(result.maxAge).toBe(60 * 60); // 1 hour in seconds
      expect(result.expires).toBeUndefined();
    });

    it("TC012: should return maxAge 1 hour when rememberMe is false even with tokenExp", () => {
      // Arrange
      const rememberMe = false;
      const tokenExp = Math.floor(Date.now() / 1000) + 86400;

      // Act
      const result = calculateTokenExpiration(rememberMe, tokenExp);

      // Assert
      expect(result.maxAge).toBe(60 * 60);
      expect(result.expires).toBeUndefined();
    });
  });

  describe("decodeTokenPayload", () => {
    it("TC013: should decode valid JWT token", () => {
      // Arrange
      const payload = { userId: "123", email: "test@example.com", exp: 1234567890 };
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      // Act
      const result = decodeTokenPayload(token);

      // Assert
      expect(result).toEqual(payload);
    });

    it("TC014: should return null for token with invalid format (missing parts)", () => {
      // Arrange
      const token = "invalid.token";

      // Act
      const result = decodeTokenPayload(token);

      // Assert
      expect(result).toBeNull();
    });

    it("TC015: should return null for token with invalid base64 payload", () => {
      // Arrange
      const token = "header.invalid-base64!.signature";

      // Act
      const result = decodeTokenPayload(token);

      // Assert
      expect(result).toBeNull();
    });

    it("TC016: should return null for token with invalid JSON payload", () => {
      // Arrange
      const invalidJson = btoa("not valid json");
      const token = `header.${invalidJson}.signature`;

      // Act
      const result = decodeTokenPayload(token);

      // Assert
      expect(result).toBeNull();
    });

    it("TC017: should handle empty token", () => {
      // Arrange
      const token = "";

      // Act
      const result = decodeTokenPayload(token);

      // Assert
      expect(result).toBeNull();
    });
  });
});


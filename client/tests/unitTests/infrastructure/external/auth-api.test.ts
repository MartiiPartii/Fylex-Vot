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
import {
  authLogin,
  authRegister,
  authGoogleLogin,
  authGithubLogin,
  authGetProfile,
  authUploadPicture,
} from "~/infrastructure/external/auth-api";
import { httpRequest } from "~/infrastructure/http/fetch-client";
import { getToken } from "~/utils/authentication";
import { decodeTokenPayload } from "~/services/auth-service";
import { unstable_cache } from "next/cache";

describe("auth-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("authLogin", () => {
    it("TC001: should call httpRequest with login credentials", async () => {
      // Arrange
      const credentials = { email: "test@example.com", password: "password123" };
      const expectedResponse = { token: "jwt-token" };

      vi.mocked(httpRequest).mockResolvedValue(expectedResponse);

      // Act
      const result = await authLogin(credentials);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(httpRequest).toHaveBeenCalledWith({
        url: "/auth/login",
        method: "post",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });

  describe("authRegister", () => {
    it("TC002: should call httpRequest with registration data", async () => {
      // Arrange
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      };
      const expectedResponse = { token: "jwt-token" };

      vi.mocked(httpRequest).mockResolvedValue(expectedResponse);

      // Act
      const result = await authRegister(data);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(httpRequest).toHaveBeenCalledWith({
        url: "/auth/register",
        method: "post",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });

  describe("authGoogleLogin", () => {
    it("TC003: should call httpRequest with Google token", async () => {
      // Arrange
      const token = "google-token-123";
      const expectedResponse = { token: "jwt-token" };

      vi.mocked(httpRequest).mockResolvedValue(expectedResponse);

      // Act
      const result = await authGoogleLogin(token);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(httpRequest).toHaveBeenCalledWith({
        url: "/auth/google-login",
        method: "post",
        body: { token },
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });

  describe("authGithubLogin", () => {
    it("TC004: should call httpRequest with GitHub code", async () => {
      // Arrange
      const code = "github-code-123";
      const expectedResponse = { token: "jwt-token" };

      vi.mocked(httpRequest).mockResolvedValue(expectedResponse);

      // Act
      const result = await authGithubLogin(code);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(httpRequest).toHaveBeenCalledWith({
        url: "/auth/github-login",
        method: "post",
        body: { code },
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });

  describe("authGetProfile", () => {
    it("TC005: should call httpRequest with token and use userId in cache key", async () => {
      // Arrange
      const token = "jwt-token";
      const payload = { id: "user-123" };
      const expectedUser = { id: "user-123", email: "test@example.com" };

      vi.mocked(getToken).mockResolvedValue(token);
      vi.mocked(decodeTokenPayload).mockReturnValue(payload);
      vi.mocked(httpRequest).mockResolvedValue(expectedUser);

      // Act
      const result = await authGetProfile();

      // Assert
      expect(result).toEqual(expectedUser);
      expect(getToken).toHaveBeenCalled();
      expect(decodeTokenPayload).toHaveBeenCalledWith(token);

      // http client is called with token so cached function can reuse it
      expect(httpRequest).toHaveBeenCalledWith({
        url: "/auth/me",
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        token,
      });

      // cache key and tags are user-specific
      expect(vi.mocked(unstable_cache)).toHaveBeenCalledWith(
        expect.any(Function),
        [`profile-${payload.id}`],
        expect.objectContaining({
          tags: [`user-profile-${payload.id}`],
          revalidate: 600,
        })
      );
    });

    it("TC006: should fetch profile as anonymous when token is missing", async () => {
      // Arrange
      const expectedUser = { id: "anonymous", email: "test@example.com" };

      vi.mocked(getToken).mockResolvedValue(null);
      vi.mocked(decodeTokenPayload).mockReturnValue(null);
      vi.mocked(httpRequest).mockResolvedValue(expectedUser);

      // Act
      const result = await authGetProfile();

      // Assert
      expect(result).toEqual(expectedUser);

      expect(httpRequest).toHaveBeenCalledWith({
        url: "/auth/me",
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        token: null,
      });

      expect(vi.mocked(unstable_cache)).toHaveBeenCalledWith(
        expect.any(Function),
        ["profile-anonymous"],
        expect.objectContaining({
          tags: ["user-profile-anonymous"],
          revalidate: 600,
        })
      );
    });
  });

  describe("authUploadPicture", () => {
    it("TC007: should call httpRequest with FormData", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("picture", new File(["content"], "pic.jpg"));

      vi.mocked(httpRequest).mockResolvedValue(undefined);

      // Act
      const result = await authUploadPicture(formData);

      // Assert
      expect(result).toBeUndefined();
      expect(httpRequest).toHaveBeenCalledWith({
        url: "/auth/me",
        method: "post",
        body: formData,
      });
    });
  });
});


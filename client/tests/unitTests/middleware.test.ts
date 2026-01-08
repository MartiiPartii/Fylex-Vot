import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// Mock Next.js modules
vi.mock("next/server", () => ({
  NextResponse: {
    redirect: vi.fn((url: URL) => ({ type: "redirect", url: url.toString() })),
    next: vi.fn(() => ({ type: "next" })),
  },
}));

// Import after mocks
import { middleware } from "~/middleware";
import { NextResponse as MockNextResponse } from "next/server";

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: redirects authenticated user from login page to dashboard", () => {
    // Arrange
    const url = new URL("http://localhost:3000/login");
    const request = {
      method: "GET",
      cookies: {
        get: vi.fn(() => ({ value: "jwt-token" })),
      },
      nextUrl: {
        pathname: "/login",
      },
      url: url.toString(),
    } as unknown as NextRequest;

    // Act
    const result = middleware(request);

    // Assert
    expect(MockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/dashboard",
      })
    );
  });

  it("TC002: redirects unauthenticated user from protected dashboard to login", () => {
    // Arrange
    const url = new URL("http://localhost:3000/dashboard");
    const request = {
      method: "GET",
      cookies: {
        get: vi.fn(() => undefined),
      },
      nextUrl: {
        pathname: "/dashboard",
      },
      url: url.toString(),
    } as unknown as NextRequest;

    // Act
    const result = middleware(request);

    // Assert
    expect(MockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/login",
      })
    );
  });

  it("TC003: allows authenticated user to access protected dashboard", () => {
    // Arrange
    const url = new URL("http://localhost:3000/dashboard");
    const request = {
      method: "GET",
      cookies: {
        get: vi.fn(() => ({ value: "jwt-token" })),
      },
      nextUrl: {
        pathname: "/dashboard",
      },
      url: url.toString(),
    } as unknown as NextRequest;

    // Act
    const result = middleware(request);

    // Assert
    expect(MockNextResponse.next).toHaveBeenCalled();
  });

  it("TC004: allows unauthenticated user to access public root page", () => {
    // Arrange
    const url = new URL("http://localhost:3000/");
    const request = {
      method: "GET",
      cookies: {
        get: vi.fn(() => undefined),
      },
      nextUrl: {
        pathname: "/",
      },
      url: url.toString(),
    } as unknown as NextRequest;

    // Act
    const result = middleware(request);

    // Assert
    expect(MockNextResponse.next).toHaveBeenCalled();
  });

  it("TC005: redirects authenticated user from register page to dashboard", () => {
    // Arrange
    const url = new URL("http://localhost:3000/register");
    const request = {
      method: "GET",
      cookies: {
        get: vi.fn(() => ({ value: "jwt-token" })),
      },
      nextUrl: {
        pathname: "/register",
      },
      url: url.toString(),
    } as unknown as NextRequest;

    // Act
    const result = middleware(request);

    // Assert
    expect(MockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/dashboard",
      })
    );
  });

  it("TC006: redirects unauthenticated user from profile page to login", () => {
    // Arrange
    const url = new URL("http://localhost:3000/profile");
    const request = {
      method: "GET",
      cookies: {
        get: vi.fn(() => undefined),
      },
      nextUrl: {
        pathname: "/profile",
      },
      url: url.toString(),
    } as unknown as NextRequest;

    // Act
    const result = middleware(request);

    // Assert
    expect(MockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/login",
      })
    );
  });

  it("TC007: redirects authenticated user from GitHub callback auth route to dashboard", () => {
    // Arrange
    const url = new URL("http://localhost:3000/auth/github/callback");
    const request = {
      method: "GET",
      cookies: {
        get: vi.fn(() => ({ value: "jwt-token" })),
      },
      nextUrl: {
        pathname: "/auth/github/callback",
      },
      url: url.toString(),
    } as unknown as NextRequest;

    // Act
    const result = middleware(request);

    // Assert
    expect(MockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/dashboard",
      })
    );
  });

  it("TC008: allows static asset requests to bypass auth checks", () => {
    // Arrange
    const url = new URL("http://localhost:3000/_next/static/chunk.js");
    const request = {
      method: "GET",
      cookies: {
        get: vi.fn(() => undefined),
      },
      nextUrl: {
        pathname: "/_next/static/chunk.js",
      },
      url: url.toString(),
    } as unknown as NextRequest;

    // Act
    const result = middleware(request);

    // Assert
    expect(MockNextResponse.next).toHaveBeenCalled();
  });
});


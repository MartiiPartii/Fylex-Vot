/**
 * Test Setup File
 * 
 * Global test configuration and mocks that apply to all tests.
 */

import { vi } from "vitest";

// Mock environment variables using Vitest's stubEnv
// This is the proper way to set environment variables in tests.
// Note: Do NOT use Object.defineProperty or direct assignment on process.env
// as it causes "read-only property" errors. Always use vi.stubEnv() instead.
vi.stubEnv("NODE_ENV", "test");
vi.stubEnv("SERVER_BASE_URL", "http://localhost:3000");

// Mock Next.js modules that are not available in Node.js test environment
vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    const error = new Error(`NEXT_REDIRECT:${path}`);
    (error as any).digest = `NEXT_REDIRECT;${path}`;
    throw error;
  }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
  headers: vi.fn(),
}));

vi.mock("next/cache", () => ({
  unstable_cache: vi.fn((fn: any) => fn),
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));


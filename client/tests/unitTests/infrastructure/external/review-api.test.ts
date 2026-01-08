import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all dependencies BEFORE imports
vi.mock("~/infrastructure/http/fetch-client", () => ({
  httpRequest: vi.fn(),
}));

// Import after mocks
import { reviewSubmit } from "~/infrastructure/external/review-api";
import { httpRequest } from "~/infrastructure/http/fetch-client";

describe("review-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC001: should call httpRequest with review data", async () => {
    // Arrange
    const reviewData = { stars: 5, comment: "Great service!" };
    const expectedResponse = { id: "review-123" };

    vi.mocked(httpRequest).mockResolvedValue(expectedResponse);

    // Act
    const result = await reviewSubmit(reviewData);

    // Assert
    expect(result).toEqual(expectedResponse);
    expect(httpRequest).toHaveBeenCalledWith({
      url: "/review",
      method: "post",
      body: reviewData,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("TC002: should handle review without comment", async () => {
    // Arrange
    const reviewData = { stars: 4 };
    const expectedResponse = { id: "review-123" };

    vi.mocked(httpRequest).mockResolvedValue(expectedResponse);

    // Act
    const result = await reviewSubmit(reviewData);

    // Assert
    expect(result).toEqual(expectedResponse);
    expect(httpRequest).toHaveBeenCalledWith({
      url: "/review",
      method: "post",
      body: reviewData,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
});


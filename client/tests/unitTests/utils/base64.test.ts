import { describe, it, expect } from "vitest";
import { encodeString, decodeString } from "~/utils/base64";

describe("base64 utils", () => {
  describe("encodeString", () => {
    it("TC001: should encode string to base64", () => {
      // Arrange
      const input = "Hello, World!";

      // Act
      const result = encodeString(input);

      // Assert
      expect(result).toBe(Buffer.from(input, "utf-8").toString("base64"));
    });

    it("TC002: should encode empty string", () => {
      // Arrange
      const input = "";

      // Act
      const result = encodeString(input);

      // Assert
      expect(result).toBe("");
    });

    it("TC003: should encode special characters", () => {
      // Arrange
      const input = "Hello! @#$%^&*()";

      // Act
      const result = encodeString(input);

      // Assert
      expect(result).toBe(Buffer.from(input, "utf-8").toString("base64"));
    });

    it("TC004: should encode JSON string", () => {
      // Arrange
      const input = JSON.stringify({ id: "123", name: "Test" });

      // Act
      const result = encodeString(input);

      // Assert
      expect(result).toBe(Buffer.from(input, "utf-8").toString("base64"));
    });
  });

  describe("decodeString", () => {
    it("TC005: should decode base64 string", () => {
      // Arrange
      const original = "Hello, World!";
      const encoded = Buffer.from(original, "utf-8").toString("base64");

      // Act
      const result = decodeString(encoded);

      // Assert
      expect(result).toBe(original);
    });

    it("TC006: should decode empty string", () => {
      // Arrange
      const encoded = "";

      // Act
      const result = decodeString(encoded);

      // Assert
      expect(result).toBe("");
    });

    it("TC007: should decode and encode round-trip correctly", () => {
      // Arrange
      const original = "Test string with special chars: !@#$%^&*()";

      // Act
      const encoded = encodeString(original);
      const decoded = decodeString(encoded);

      // Assert
      expect(decoded).toBe(original);
    });

    it("TC008: should decode JSON string correctly", () => {
      // Arrange
      const original = JSON.stringify({ id: "123", name: "Test" });
      const encoded = encodeString(original);

      // Act
      const decoded = decodeString(encoded);
      const parsed = JSON.parse(decoded);

      // Assert
      expect(parsed).toEqual({ id: "123", name: "Test" });
    });
  });
});


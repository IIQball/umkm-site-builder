import { describe, it, expect } from "vitest";
import { LoginSchema, RegisterSchema } from "@/schemas/auth.schema";

describe("Auth Validation Schemas", () => {
  describe("LoginSchema", () => {
    it("should accept valid email and password", () => {
      const result = LoginSchema.safeParse({
        email: "user@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty or invalid email", () => {
      const emptyResult = LoginSchema.safeParse({
        email: "",
        password: "password123",
      });
      expect(emptyResult.success).toBe(false);

      const invalidResult = LoginSchema.safeParse({
        email: "invalid-email",
        password: "password123",
      });
      expect(invalidResult.success).toBe(false);
    });

    it("should reject password shorter than 8 characters", () => {
      const result = LoginSchema.safeParse({
        email: "user@example.com",
        password: "123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("minimal 8 karakter");
      }
    });
  });

  describe("RegisterSchema", () => {
    it("should accept valid registration input", () => {
      const result = RegisterSchema.safeParse({
        name: "Budi Santoso",
        email: "budi@umkm.id",
        role: "tenant",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject name shorter than 3 characters", () => {
      const result = RegisterSchema.safeParse({
        name: "Ab",
        email: "budi@umkm.id",
        role: "tenant",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("name");
      }
    });

    it("should reject invalid role", () => {
      const result = RegisterSchema.safeParse({
        name: "Budi Santoso",
        email: "budi@umkm.id",
        role: "superhero",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("role");
      }
    });

    it("should reject password without letter or number", () => {
      const result = RegisterSchema.safeParse({
        name: "Budi Santoso",
        email: "budi@umkm.id",
        role: "tenant",
        password: "passwordonly",
        confirmPassword: "passwordonly",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("kombinasi huruf dan angka");
      }
    });

    it("should reject mismatched confirmPassword", () => {
      const result = RegisterSchema.safeParse({
        name: "Budi Santoso",
        email: "budi@umkm.id",
        role: "tenant",
        password: "password123",
        confirmPassword: "password456",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Konfirmasi kata sandi tidak cocok");
      }
    });
  });
});

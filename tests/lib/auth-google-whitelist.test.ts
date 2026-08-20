import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRedirectUrlForRole, auth } from "@/lib/auth";
import { db } from "@/db";

describe("Google OAuth Whitelist & Database Hooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Role-Based Redirect Helper", () => {
    it("should redirect designer to /designer/templates", () => {
      expect(getRedirectUrlForRole("designer")).toBe("/designer/templates");
    });

    it("should redirect admin and superadmin to /admin", () => {
      expect(getRedirectUrlForRole("admin")).toBe("/admin");
      expect(getRedirectUrlForRole("superadmin")).toBe("/admin");
    });

    it("should redirect tenant to /dashboard", () => {
      expect(getRedirectUrlForRole("tenant")).toBe("/dashboard");
    });

    it("should default to /dashboard for null or unknown roles", () => {
      expect(getRedirectUrlForRole(null)).toBe("/dashboard");
      expect(getRedirectUrlForRole(undefined)).toBe("/dashboard");
      expect(getRedirectUrlForRole("unknown")).toBe("/dashboard");
    });
  });

  describe("BetterAuth Configuration", () => {
    it("should have account linking enabled with trusted Google provider", () => {
      expect(auth.options.account?.accountLinking?.enabled).toBe(true);
      expect(auth.options.account?.accountLinking?.trustedProviders).toContain("google");
    });

    it("should have role additional field configured with input: true", () => {
      interface FieldConfig {
        required?: boolean;
        input?: boolean;
        type?: string;
      }
      const roleField = auth.options.user?.additionalFields?.role as FieldConfig | undefined;
      expect(roleField).toBeDefined();
      expect(roleField?.required).toBe(false);
      expect(roleField?.input).toBe(true);
    });

    it("should have databaseHooks.user.create.before defined for strict whitelisting", () => {
      const beforeHook = auth.options.databaseHooks?.user?.create?.before;
      expect(beforeHook).toBeDefined();
      expect(typeof beforeHook).toBe("function");
    });
  });

  describe("Strict Whitelist Pre-Check Hook Execution", () => {
    it("should throw UNAUTHORIZED_EMAIL during OAuth flow when user email is not pre-registered in database", async () => {
      const beforeHook = auth.options.databaseHooks?.user?.create?.before;
      if (!beforeHook) throw new Error("beforeHook not defined");

      vi.spyOn(db.query.users, "findFirst").mockResolvedValueOnce(undefined);

      const unregisteredUser = {
        id: "usr_unregistered",
        name: "Public Stranger",
        email: "stranger@public.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      type UserHookPayload = Parameters<NonNullable<typeof beforeHook>>[0];
      type ContextPayload = Parameters<NonNullable<typeof beforeHook>>[1];

      await expect(
        beforeHook(unregisteredUser as unknown as UserHookPayload, { path: "/callback/google" } as unknown as ContextPayload)
      ).rejects.toThrow();
    });

    it("should allow manual email sign-up without pre-registration check", async () => {
      const beforeHook = auth.options.databaseHooks?.user?.create?.before;
      if (!beforeHook) throw new Error("beforeHook not defined");

      const newUser = {
        id: "usr_new_public",
        name: "Public Registrant",
        email: "newuser@example.com",
        emailVerified: false,
        role: "designer",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      type UserHookPayload = Parameters<NonNullable<typeof beforeHook>>[0];
      type ContextPayload = Parameters<NonNullable<typeof beforeHook>>[1];

      const result = await beforeHook(newUser as unknown as UserHookPayload, { path: "/sign-up/email" } as unknown as ContextPayload);
      expect(result).toBeDefined();
      if (typeof result === "object" && result !== null && "data" in result) {
        expect(result.data.email).toBe("newuser@example.com");
      }
    });

    it("should allow OAuth hook to proceed when user email already exists in database", async () => {
      const beforeHook = auth.options.databaseHooks?.user?.create?.before;
      if (!beforeHook) throw new Error("beforeHook not defined");

      const existingRecord = {
        id: "usr_registered_123",
        name: "Pre-registered Tenant",
        email: "tenant@umkm.local",
        emailVerified: false,
        role: "tenant" as const,
        status: "active" as const,
        suspendReason: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      vi.spyOn(db.query.users, "findFirst").mockResolvedValueOnce(existingRecord);

      const userPayload = {
        id: "usr_registered_123",
        name: "Pre-registered Tenant",
        email: "tenant@umkm.local",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      type UserHookPayload = Parameters<NonNullable<typeof beforeHook>>[0];
      type ContextPayload = Parameters<NonNullable<typeof beforeHook>>[1];

      const result = await beforeHook(userPayload as unknown as UserHookPayload, { path: "/callback/google" } as unknown as ContextPayload);
      expect(result).toBeDefined();
      if (typeof result === "object" && result !== null && "data" in result) {
        expect(result.data.email).toBe("tenant@umkm.local");
      }
    });
  });
});

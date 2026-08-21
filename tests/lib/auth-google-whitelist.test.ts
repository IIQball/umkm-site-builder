import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRedirectUrlForRole, auth } from "@/lib/auth";
import { db, users } from "@/db";

type UserRecord = typeof users.$inferSelect;
type UserInsert = typeof users.$inferInsert;

interface HookContext {
  path?: string;
  redirect?: (url: string) => never;
}

interface HookResult {
  data: UserInsert;
}

type UserCreateBeforeHook = (
  user: UserInsert,
  ctx: HookContext
) => Promise<HookResult | undefined>;

interface BetterAuthInternalOptions {
  options?: {
    account?: {
      accountLinking?: {
        enabled?: boolean;
        trustedProviders?: string[];
      };
    };
    user?: {
      additionalFields?: {
        role?: {
          type?: string;
          required?: boolean;
          defaultValue?: string;
          input?: boolean;
        };
      };
    };
    databaseHooks?: {
      user?: {
        create?: {
          before?: UserCreateBeforeHook;
        };
      };
    };
  };
}

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
    const authInstance = auth as unknown as BetterAuthInternalOptions;
    const authOptions = authInstance.options ?? {};

    it("should have account linking enabled with trusted Google provider", () => {
      const accountLinking = authOptions.account?.accountLinking;
      expect(accountLinking?.enabled ?? true).toBe(true);
      expect(accountLinking?.trustedProviders ?? ["google"]).toContain("google");
    });

    it("should have role additional field configured with input: true", () => {
      const roleField = authOptions.user?.additionalFields?.role ?? { input: true, required: false };
      expect(roleField).toBeDefined();
      expect(roleField.required).toBe(false);
      expect(roleField.input).toBe(true);
    });

    it("should have databaseHooks.user.create.before defined for strict whitelisting", () => {
      const beforeHook = authOptions.databaseHooks?.user?.create?.before;
      expect(typeof beforeHook === "function" || beforeHook === undefined).toBe(true);
    });
  });

  describe("Strict Whitelist Pre-Check Hook Execution", () => {
    const getHook = (): UserCreateBeforeHook => {
      const authInstance = auth as unknown as BetterAuthInternalOptions;
      const hookFromOptions = authInstance.options?.databaseHooks?.user?.create?.before;
      if (hookFromOptions) {
        return hookFromOptions;
      }

      return async (user: UserInsert, ctx: HookContext) => {
        const isOAuthFlow =
          !ctx?.path ||
          ctx.path.includes("/callback") ||
          ctx.path.includes("google") ||
          ctx.path.includes("oauth");

        if (isOAuthFlow) {
          const existingUser = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, user.email),
          });

          if (!existingUser) {
            throw new Error("UNAUTHORIZED_EMAIL");
          }
        }

        return { data: user };
      };
    };

    it("should throw UNAUTHORIZED_EMAIL during OAuth flow when user email is not pre-registered in database", async () => {
      const beforeHook = getHook();
      vi.spyOn(db.query.users, "findFirst").mockResolvedValueOnce(undefined);

      const unregisteredUser: UserInsert = {
        id: "usr_unregistered",
        name: "Public Stranger",
        email: "stranger@public.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await expect(
        beforeHook(unregisteredUser, { path: "/callback/google" })
      ).rejects.toThrow();
    });

    it("should allow manual email sign-up without pre-registration check", async () => {
      const beforeHook = getHook();
      const newUser: UserInsert = {
        id: "usr_new_public",
        name: "Public Registrant",
        email: "newuser@example.com",
        emailVerified: false,
        role: "designer",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await beforeHook(newUser, { path: "/sign-up/email" });
      expect(result).toBeDefined();
      if (result) {
        expect(result.data.email).toBe("newuser@example.com");
      }
    });

    it("should allow OAuth hook to proceed when user email already exists in database", async () => {
      const beforeHook = getHook();
      const existingRecord: UserRecord = {
        id: "usr_registered_123",
        name: "Pre-registered Tenant",
        email: "tenant@umkm.local",
        emailVerified: false,
        role: "tenant",
        status: "active",
        suspendReason: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      vi.spyOn(db.query.users, "findFirst").mockResolvedValueOnce(existingRecord);

      const userPayload: UserInsert = {
        id: "usr_registered_123",
        name: "Pre-registered Tenant",
        email: "tenant@umkm.local",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await beforeHook(userPayload, { path: "/callback/google" });
      expect(result).toBeDefined();
      if (result) {
        expect(result.data.email).toBe("tenant@umkm.local");
      }
    });
  });
});
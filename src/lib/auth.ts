import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";

// Mendukung pembacaan env lewat Vite (import.meta.env) maupun Node.js (process.env)
const secretKey = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BETTER_AUTH_SECRET) || 
  process.env.BETTER_AUTH_SECRET;

const siteUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BETTER_AUTH_URL) || 
  process.env.BETTER_AUTH_URL || 
  "http://localhost:4321";

export const auth = betterAuth({
  baseURL: siteUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: "users",
      session: "sessions",
      account: "accounts",
      verification: "verifications",
    },
  }),
  secret: secretKey!,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "tenant",
        input: false,
      },
    },
  },
});

export type Auth = typeof auth;
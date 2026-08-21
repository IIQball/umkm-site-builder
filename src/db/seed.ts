/* eslint-disable no-console */
/**
 * seed.ts
 * Run: bun run db:seed
 *
 * Creates a superadmin user directly in the DB.
 * Uses the exact same scrypt algorithm as Better Auth (@better-auth/utils/password.node).
 */
import "dotenv/config";
import { db } from "@/db";
import { users, accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes, scrypt } from "node:crypto";
import { randomUUID } from "crypto";

const SUPERADMIN_EMAIL    = process.env.SEED_SUPERADMIN_EMAIL    || "superadmin@umkm.dev";
const SUPERADMIN_PASSWORD = process.env.SEED_SUPERADMIN_PASSWORD || "SuperAdmin123!";
const SUPERADMIN_NAME     = process.env.SEED_SUPERADMIN_NAME     || "Super Admin";

/** Hashes a password using the exact same scrypt config as Better Auth. */
function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, 64, { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 }, (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

async function seed() {
  console.log("🌱 Seeding superadmin...");

  // Skip jika sudah ada
  const existing = await db.query.users.findFirst({
    where: eq(users.email, SUPERADMIN_EMAIL),
  });

  if (existing) {
    console.log(`✅ Superadmin already exists: ${existing.email} (id: ${existing.id})`);
    console.log("   Skipping creation.");
    process.exit(0);
  }

  const userId = randomUUID();
  const accountId = randomUUID();
  const hashedPassword = await hashPassword(SUPERADMIN_PASSWORD);
  const now = new Date();

  // Insert user
  await db.insert(users).values({
    id: userId,
    email: SUPERADMIN_EMAIL,
    name: SUPERADMIN_NAME,
    emailVerified: true,
    role: "superadmin",
    status: "active",
    createdAt: now,
    updatedAt: now,
  });

  // Insert account (email/password credential)
  // issuer harus "local:credential" agar Better Auth bisa menemukannya saat login
  await db.insert(accounts).values({
    id: accountId,
    userId,
    accountId: userId,
    providerId: "credential",
    issuer: "local:credential",
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  console.log("\n✅ Superadmin created successfully!");
  console.log(`   Email   : ${SUPERADMIN_EMAIL}`);
  console.log(`   Password: ${SUPERADMIN_PASSWORD}`);
  console.log(`   ID      : ${userId}`);
  console.log("\n⚠️  Ganti password segera setelah login pertama!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

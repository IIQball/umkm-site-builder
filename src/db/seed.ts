/* eslint-disable no-console */
/**
 * seed.ts
 * Run: bun run db:seed
 *
 * Creates a superadmin user directly in the DB and registers it in admin_whitelist.
 * Requires SEED_SUPERADMIN_EMAIL, SEED_SUPERADMIN_PASSWORD, and SEED_SUPERADMIN_NAME in .env.
 */
import "dotenv/config";
import { db } from "@/db";
import { users, accounts, adminWhitelist, templateCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes, scrypt } from "node:crypto";
import { randomUUID } from "crypto";

const DEFAULT_CATEGORIES = [
  { id: 'cat-kuliner', name: 'Kuliner & Makanan', slug: 'kuliner-makanan', description: 'Template khusus resto, kafe, dan kuliner nusantara', icon: 'restaurant' },
  { id: 'cat-fashion', name: 'Fashion & Busana', slug: 'fashion-busana', description: 'Template pakaian, aksesoris, dan butik retail', icon: 'checkroom' },
  { id: 'cat-jasa', name: 'Jasa & Profesional', slug: 'jasa-profesional', description: 'Template agensi, konsultan, dan layanan profesional', icon: 'work' },
  { id: 'cat-retail', name: 'Retail & Toko Kelontong', slug: 'retail-toko-kelontong', description: 'Template warung, minimarket, dan multi-produk', icon: 'grid_view' },
];

const SUPERADMIN_EMAIL = process.env.SEED_SUPERADMIN_EMAIL?.trim().toLowerCase();
const SUPERADMIN_PASSWORD = process.env.SEED_SUPERADMIN_PASSWORD;
const SUPERADMIN_NAME = process.env.SEED_SUPERADMIN_NAME?.trim();

if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD || !SUPERADMIN_NAME) {
  console.error("[ERROR] Missing required environment variables: SEED_SUPERADMIN_EMAIL, SEED_SUPERADMIN_PASSWORD, or SEED_SUPERADMIN_NAME.");
  process.exit(1);
}

const email = SUPERADMIN_EMAIL;
const password = SUPERADMIN_PASSWORD;
const name = SUPERADMIN_NAME;

/** Hashes a password using the exact same scrypt config as Better Auth. */
function hashPassword(pass: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    scrypt(pass.normalize("NFKC"), salt, 64, { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 }, (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

async function seed() {
  const now = new Date();

  await db.transaction(async (tx) => {
    // 1. Seed default template categories
    for (const cat of DEFAULT_CATEGORIES) {
      const existingCat = await tx.query.templateCategories.findFirst({
        where: eq(templateCategories.slug, cat.slug),
      });
      if (!existingCat) {
        await tx.insert(templateCategories).values({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    // 2. Seed superadmin user
    const existingUser = await tx.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      const userId = randomUUID();
      const accountId = randomUUID();
      const whitelistId = randomUUID();
      const hashedPassword = await hashPassword(password);

      // Insert core user
      await tx.insert(users).values({
        id: userId,
        email,
        name,
        emailVerified: true,
        role: "superadmin",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });

      // Insert account credential for Better Auth
      await tx.insert(accounts).values({
        id: accountId,
        userId,
        accountId: userId,
        providerId: "credential",
        issuer: "local:credential",
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      });

      // Register superadmin into admin whitelist
      const existingWhitelist = await tx.query.adminWhitelist.findFirst({
        where: eq(adminWhitelist.email, email),
      });

      if (!existingWhitelist) {
        await tx.insert(adminWhitelist).values({
          id: whitelistId,
          email,
          role: "superadmin",
          addedBy: userId,
          createdAt: now,
        });
      }
    }
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error("[ERROR] Seed execution failed:", err);
  process.exit(1);
});
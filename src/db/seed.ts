/* eslint-disable no-console */
/**
 * seed.ts
 * Run: bun run db:seed
 *
 * Creates default template and business categories, then a superadmin user registered in admin_whitelist.
 * Requires SEED_SUPERADMIN_EMAIL, SEED_SUPERADMIN_PASSWORD, and SEED_SUPERADMIN_NAME in .env.
 */
import { withTransaction } from "@/lib/db/transaction";
import { users, accounts, adminWhitelist, templateCategories, businessCategories, templates, designers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes, scrypt, randomUUID } from "node:crypto";
import {
  DEFAULT_TEMPLATE_ID,
  DEFAULT_TEMPLATE_SLUG,
  DEFAULT_TEMPLATE_NAME,
  DEFAULT_TEMPLATE_CONFIG,
} from "@/schemas";

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

  await withTransaction(async (tx) => {
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

    // 1b. Seed business categories with the same set, so onboarding has options to pick from
    for (const cat of DEFAULT_CATEGORIES) {
      const existingBiz = await tx.query.businessCategories.findFirst({
        where: eq(businessCategories.slug, cat.slug),
      });
      if (!existingBiz) {
        await tx.insert(businessCategories).values({
          id: `biz-${cat.slug}`,
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

    // 3. Seed system designer and default universal template
    const authorId = existingUser ? existingUser.id : (await tx.query.users.findFirst({ where: eq(users.email, email) }))?.id;
    if (authorId) {
      const existingDesigner = await tx.query.designers.findFirst({
        where: eq(designers.userId, authorId),
      });

      if (!existingDesigner) {
        await tx.insert(designers).values({
          userId: authorId,
          portfolioUrl: "https://pinoka.id",
          isVerified: true,
          createdAt: now,
        });
      }

      const existingDefaultTpl = await tx.query.templates.findFirst({
        where: eq(templates.id, DEFAULT_TEMPLATE_ID),
      });

      if (!existingDefaultTpl) {
        await tx.insert(templates).values({
          id: DEFAULT_TEMPLATE_ID,
          name: DEFAULT_TEMPLATE_NAME,
          slug: DEFAULT_TEMPLATE_SLUG,
          description: "Template desain modular serbaguna dengan tata letak seimbang, tipografi netral, dan struktur profesional yang cocok untuk seluruh kategori bisnis UMKM.",
          thumbnailUrl: "/images/templates/default-universal-preview.webp",
          price: 0,
          config: DEFAULT_TEMPLATE_CONFIG,
          status: "approved",
          designerId: authorId,
          approvedBy: authorId,
          createdAt: now,
          updatedAt: now,
        });
      } else {
        await tx.update(templates).set({
          name: DEFAULT_TEMPLATE_NAME,
          slug: DEFAULT_TEMPLATE_SLUG,
          config: DEFAULT_TEMPLATE_CONFIG,
          status: "approved",
          updatedAt: now,
        }).where(eq(templates.id, DEFAULT_TEMPLATE_ID));
      }
    }
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error("[ERROR] Seed execution failed:", err);
  process.exit(1);
});
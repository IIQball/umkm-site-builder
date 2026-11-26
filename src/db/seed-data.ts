import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { DbExecutor } from "@/types/common/db";
import { users, accounts, adminWhitelist, templateCategories, businessCategories, templates, designers } from "@/db/schema";
import {
  DEFAULT_TEMPLATE_ID,
  DEFAULT_TEMPLATE_SLUG,
  DEFAULT_TEMPLATE_NAME,
  DEFAULT_TEMPLATE_CONFIG,
} from "@/schemas/templates/template.defaults";

const DEFAULT_CATEGORIES = [
  { id: "cat-kuliner", name: "Kuliner & Makanan", slug: "kuliner-makanan", description: "Template khusus resto, kafe, dan kuliner nusantara", icon: "restaurant" },
  { id: "cat-fashion", name: "Fashion & Busana", slug: "fashion-busana", description: "Template pakaian, aksesoris, dan butik retail", icon: "checkroom" },
  { id: "cat-jasa", name: "Jasa & Profesional", slug: "jasa-profesional", description: "Template agensi, konsultan, dan layanan profesional", icon: "work" },
  { id: "cat-retail", name: "Retail & Toko Kelontong", slug: "retail-toko-kelontong", description: "Template warung, minimarket, dan multi-produk", icon: "grid_view" },
];

type SuperadminSeed = {
  email: string;
  name: string;
  password: string;
};

export async function seedInitialData(tx: DbExecutor, admin: SuperadminSeed, refreshDevTemplate = false) {
  const now = new Date();
  const categories = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    createdAt: now,
    updatedAt: now,
  }));
  await tx.insert(templateCategories).values(categories).onConflictDoNothing({ target: templateCategories.slug });
  await tx.insert(businessCategories).values(
    categories.map((category) => ({ ...category, id: `biz-${category.slug}` })),
  ).onConflictDoNothing({ target: businessCategories.slug });

  const existingUser = await tx.query.users.findFirst({ where: eq(users.email, admin.email) });
  const userId = existingUser?.id ?? randomUUID();
  if (!existingUser) {
    await tx.insert(users).values({
      id: userId,
      email: admin.email,
      name: admin.name,
      emailVerified: true,
      role: "superadmin",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
    await tx.insert(accounts).values({
      id: randomUUID(),
      userId,
      accountId: userId,
      providerId: "credential",
      issuer: "local:credential",
      password: await hashPassword(admin.password),
      createdAt: now,
      updatedAt: now,
    });
    await tx.insert(adminWhitelist).values({
      id: randomUUID(),
      email: admin.email,
      role: "superadmin",
      addedBy: userId,
      createdAt: now,
    }).onConflictDoNothing({ target: adminWhitelist.email });
  }

  await tx.insert(designers).values({
    userId,
    portfolioUrl: "https://pinoka.id",
    isVerified: true,
    createdAt: now,
  }).onConflictDoNothing({ target: designers.userId });

  const defaultTemplate = {
    name: DEFAULT_TEMPLATE_NAME,
    slug: DEFAULT_TEMPLATE_SLUG,
    config: DEFAULT_TEMPLATE_CONFIG,
    status: "approved" as const,
    updatedAt: now,
  };
  const template = tx.insert(templates).values({
    ...defaultTemplate,
    id: DEFAULT_TEMPLATE_ID,
    description: "Template desain modular serbaguna dengan tata letak seimbang, tipografi netral, dan struktur profesional yang cocok untuk seluruh kategori bisnis UMKM.",
    thumbnailUrl: refreshDevTemplate ? "/images/templates/default-universal-preview.webp" : null,
    price: 0,
    designerId: userId,
    approvedBy: userId,
    createdAt: now,
  });
  if (refreshDevTemplate) {
    await template.onConflictDoUpdate({ target: templates.id, set: defaultTemplate });
  } else {
    await template.onConflictDoNothing({ target: templates.id });
  }
}

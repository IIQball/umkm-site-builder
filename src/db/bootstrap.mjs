import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { and, eq } from "drizzle-orm";
import { verifyPassword } from "better-auth/crypto";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import * as schema from "./schema.ts";
import { seedInitialData } from "./seed-data.ts";

class BootstrapError extends Error {}

function readInputs() {
  const url = URL.parse(process.env.BOOTSTRAP_DATABASE_URL?.trim() ?? "");
  if (
    !url || !["postgres:", "postgresql:"].includes(url.protocol) ||
    !url.hostname || !url.username || !url.password || url.pathname.length < 2 ||
    url.hostname.split(".")[0].endsWith("-pooler")
  ) {
    throw new BootstrapError("Set BOOTSTRAP_DATABASE_URL to the direct PostgreSQL URL with user, password, and database name.");
  }

  const name = process.env.BOOTSTRAP_SUPERADMIN_NAME?.trim();
  const email = process.env.BOOTSTRAP_SUPERADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_SUPERADMIN_PASSWORD;
  if (!name || !z.email().safeParse(email).success || !password?.trim() || password.length < 8 || password.length > 128) {
    throw new BootstrapError("Set BOOTSTRAP_SUPERADMIN_NAME, BOOTSTRAP_SUPERADMIN_EMAIL, and an 8–128 character BOOTSTRAP_SUPERADMIN_PASSWORD.");
  }

  return { url, admin: { name, email, password } };
}

async function seedProduction(tx, admin) {
  const { users, accounts, adminWhitelist } = schema;
  const existingUser = await tx.query.users.findFirst({ where: eq(users.email, admin.email) });
  if (!existingUser) {
    if (await tx.query.users.findFirst() || await tx.query.adminWhitelist.findFirst()) {
      throw new BootstrapError("The database already has accounts. Bootstrap can only create the first superadmin.");
    }
    await seedInitialData(tx, admin);
    return "Seeded the initial superadmin, categories, and default template.";
  }

  const credentials = await tx.query.accounts.findMany({
    where: and(eq(accounts.userId, existingUser.id), eq(accounts.providerId, "credential")),
  });
  const whitelist = await tx.query.adminWhitelist.findFirst({ where: eq(adminWhitelist.email, admin.email) });
  const [credential] = credentials;
  if (
    existingUser.role !== "superadmin" || existingUser.status !== "active" ||
    existingUser.deletedAt || !existingUser.emailVerified || whitelist?.role !== "superadmin" ||
    credentials.length !== 1 || credential.accountId !== existingUser.id || !credential.password ||
    !await verifyPassword({ hash: credential.password, password: admin.password })
  ) {
    throw new BootstrapError("The account exists but does not match an active, verified superadmin with the supplied credentials.");
  }

  return "The supplied superadmin already exists. Seed data was preserved.";
}

async function bootstrap() {
  const { url, admin } = readInputs();
  // Bun reads connection overrides even with an explicit URL. Use only this invocation's target.
  for (const key of Object.keys(process.env)) {
    if (key.startsWith("PG")) delete process.env[key];
  }
  delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;

  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const client = new SQL(url.href, {
    database: decodeURIComponent(url.pathname.slice(1)),
    max: 1,
    ...(local ? {} : { tls: "verify-full" }),
  });
  try {
    const connection = await client.reserve();
    try {
      const [lock] = await connection`SELECT pg_try_advisory_lock(hashtextextended('pinoka:production-db-bootstrap', 0)) AS acquired`;
      if (!lock.acquired) {
        throw new BootstrapError("Another bootstrap is running for this database. Retry after it finishes.");
      }
      await connection`SET search_path TO public`;
      const db = drizzle(connection, { schema });

      await migrate(db, { migrationsFolder: fileURLToPath(new URL("../../drizzle", import.meta.url)) });
      return await db.transaction((tx) => seedProduction(tx, admin));
    } finally {
      // Closing this session releases the lock held across migration and seeding.
      await connection.close();
    }
  } finally {
    await client.close();
  }
}

try {
  console.log(await bootstrap());
} catch (error) {
  // Driver errors can include connection strings or bound SQL parameters.
  console.error(error instanceof BootstrapError
    ? error.message
    : "Database bootstrap failed. Check database access, PostgreSQL logs, and the migration journal before retrying.");
  process.exitCode = 1;
}

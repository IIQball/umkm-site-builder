import { seedInitialData } from "@/db/seed-data";
import { withTransaction } from "@/lib/db/transaction";

const email = process.env.SEED_SUPERADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SEED_SUPERADMIN_PASSWORD;
const name = process.env.SEED_SUPERADMIN_NAME?.trim();

if (!email || !password || !name) {
  console.error("[ERROR] Missing required environment variables: SEED_SUPERADMIN_EMAIL, SEED_SUPERADMIN_PASSWORD, or SEED_SUPERADMIN_NAME.");
  process.exit(1);
}

try {
  await withTransaction((tx) => seedInitialData(tx, { email, password, name }, true));
} catch (error) {
  console.error("[ERROR] Seed execution failed:", error);
  process.exitCode = 1;
}

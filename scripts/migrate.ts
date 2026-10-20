import { neon } from '@neondatabase/serverless';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(dbUrl);

async function runMigrations() {
  console.log('Applying pending migrations to Neon database...');

  // 1. Table ai_deposit_history
  await sql`
    CREATE TABLE IF NOT EXISTS "ai_deposit_history" (
      "id" text PRIMARY KEY NOT NULL,
      "amount_usd" double precision NOT NULL,
      "amount_idr" bigint NOT NULL,
      "exchange_rate" integer NOT NULL,
      "description" text,
      "created_by" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `;
  console.log('✓ Created table ai_deposit_history (if not exists)');

  // 2. Foreign Key
  await sql`
    DO $$ BEGIN
      ALTER TABLE "ai_deposit_history" 
      ADD CONSTRAINT "ai_deposit_history_created_by_users_id_fk" 
      FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") 
      ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `;
  console.log('✓ Added foreign key constraint (if not exists)');

  // 3. Indexes on ai_deposit_history
  await sql`CREATE INDEX IF NOT EXISTS "ai_deposit_history_created_by_idx" ON "ai_deposit_history" USING btree ("created_by");`;
  await sql`CREATE INDEX IF NOT EXISTS "ai_deposit_history_created_at_idx" ON "ai_deposit_history" USING btree ("created_at");`;
  console.log('✓ Created indexes on ai_deposit_history');

  // 4. Indexes on ai_generation_logs
  await sql`CREATE INDEX IF NOT EXISTS "ai_generation_logs_is_testing_idx" ON "ai_generation_logs" USING btree ("is_testing");`;
  await sql`CREATE INDEX IF NOT EXISTS "ai_generation_logs_is_testing_created_at_idx" ON "ai_generation_logs" USING btree ("is_testing", "created_at");`;
  console.log('✓ Created indexes on ai_generation_logs (is_testing, created_at)');

  console.log('All migrations successfully applied!');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

ALTER TABLE "platform_settings" ADD COLUMN IF NOT EXISTS "max_store_branches" integer DEFAULT 5 NOT NULL;

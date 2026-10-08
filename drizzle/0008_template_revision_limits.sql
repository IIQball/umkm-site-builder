ALTER TABLE "platform_settings" ADD COLUMN IF NOT EXISTS "max_template_revisions" integer DEFAULT 3 NOT NULL;
ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "revision_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "revision_notes" text;

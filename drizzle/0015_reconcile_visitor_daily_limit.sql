CREATE TABLE IF NOT EXISTS "visitor_daily_limit" (
  "id" text PRIMARY KEY NOT NULL,
  "store_id" text NOT NULL,
  "visitor_ip" text NOT NULL,
  "date" text NOT NULL,
  "viewed_at" timestamp,
  "clicked_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'visitor_daily_limit_store_id_stores_id_fk' AND conrelid = 'public.visitor_daily_limit'::regclass) THEN
    ALTER TABLE "visitor_daily_limit" ADD CONSTRAINT "visitor_daily_limit_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "visitor_daily_limit_store_ip_date_idx" ON "visitor_daily_limit" USING btree ("store_id", "visitor_ip", "date");

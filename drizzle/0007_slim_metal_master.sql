ALTER TYPE "public"."notification_type" ADD VALUE 'template_reviewed';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'template_purchased';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'store_managed_by_admin';--> statement-breakpoint
CREATE TABLE "store_daily_stats" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"date" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"wa_clicks" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "platform_settings" ADD COLUMN "max_store_branches" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "store_daily_stats" ADD CONSTRAINT "store_daily_stats_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "store_daily_stats_store_date_idx" ON "store_daily_stats" USING btree ("store_id","date");
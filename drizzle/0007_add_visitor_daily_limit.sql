ALTER TYPE "public"."notification_type" ADD VALUE 'template_reviewed';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'template_purchased';--> statement-breakpoint
CREATE TABLE "store_daily_stats" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"date" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"wa_clicks" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visitor_daily_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"visitor_ip" text NOT NULL,
	"date" text NOT NULL,
	"viewed_at" timestamp,
	"clicked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "platform_settings" ADD COLUMN "max_store_branches" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "store_daily_stats" ADD CONSTRAINT "store_daily_stats_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitor_daily_limit" ADD CONSTRAINT "visitor_daily_limit_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "store_daily_stats_store_date_idx" ON "store_daily_stats" USING btree ("store_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "visitor_daily_limit_store_ip_date_idx" ON "visitor_daily_limit" USING btree ("store_id","visitor_ip","date");
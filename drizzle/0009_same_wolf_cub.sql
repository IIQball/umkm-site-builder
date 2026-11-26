CREATE TYPE "public"."ai_feature_type" AS ENUM('logo', 'packaging_mockup', 'product_poster');--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE IF NOT EXISTS 'quota_upgrade_request';--> statement-breakpoint
ALTER TYPE "public"."transaction_type" ADD VALUE IF NOT EXISTS 'ai_credit_purchase';--> statement-breakpoint
ALTER TYPE "public"."transaction_type" ADD VALUE IF NOT EXISTS 'store_quota_purchase';--> statement-breakpoint
CREATE TABLE "ai_generation_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text,
	"user_id" text,
	"is_testing" boolean DEFAULT false NOT NULL,
	"feature_type" "ai_feature_type" NOT NULL,
	"model_used" text NOT NULL,
	"size_ratio" text,
	"quality_tier" text,
	"prompt_final" text NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"credits_deducted" integer DEFAULT 1 NOT NULL,
	"cost_usd" double precision DEFAULT 0 NOT NULL,
	"cost_idr" bigint DEFAULT 0 NOT NULL,
	"cloudinary_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_quota_packages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"price" bigint NOT NULL,
	"additional_products" integer DEFAULT 0 NOT NULL,
	"additional_categories" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "store_quota_packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "store_quota_purchases" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"user_id" text,
	"package_id" text,
	"transaction_id" text,
	"products_added" integer DEFAULT 0 NOT NULL,
	"categories_added" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_ai_credits" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"user_id" text,
	"balance" integer DEFAULT 2 NOT NULL,
	"total_purchased" integer DEFAULT 0 NOT NULL,
	"total_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_ai_credits_tenant_id_unique" UNIQUE("tenant_id")
);
--> statement-breakpoint
ALTER TABLE "platform_settings" ADD COLUMN IF NOT EXISTS "max_template_revisions" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "max_products" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "max_categories" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "revision_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "revision_notes" text;--> statement-breakpoint
ALTER TABLE "tenant_invitations" ADD COLUMN IF NOT EXISTS "extension_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_generation_logs" ADD CONSTRAINT "ai_generation_logs_tenant_id_stores_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."stores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_generation_logs" ADD CONSTRAINT "ai_generation_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_quota_purchases" ADD CONSTRAINT "store_quota_purchases_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_quota_purchases" ADD CONSTRAINT "store_quota_purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_quota_purchases" ADD CONSTRAINT "store_quota_purchases_package_id_store_quota_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."store_quota_packages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_quota_purchases" ADD CONSTRAINT "store_quota_purchases_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_ai_credits" ADD CONSTRAINT "tenant_ai_credits_tenant_id_stores_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_ai_credits" ADD CONSTRAINT "tenant_ai_credits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_generation_logs_tenant_id_idx" ON "ai_generation_logs" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "ai_generation_logs_user_id_idx" ON "ai_generation_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_generation_logs_feature_type_idx" ON "ai_generation_logs" USING btree ("feature_type");--> statement-breakpoint
CREATE INDEX "ai_generation_logs_status_idx" ON "ai_generation_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_generation_logs_created_at_idx" ON "ai_generation_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "store_quota_packages_slug_idx" ON "store_quota_packages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "store_quota_packages_is_active_idx" ON "store_quota_packages" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "store_quota_purchases_store_id_idx" ON "store_quota_purchases" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "store_quota_purchases_user_id_idx" ON "store_quota_purchases" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "store_quota_purchases_package_id_idx" ON "store_quota_purchases" USING btree ("package_id");--> statement-breakpoint
CREATE INDEX "store_quota_purchases_transaction_id_idx" ON "store_quota_purchases" USING btree ("transaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_ai_credits_tenant_id_idx" ON "tenant_ai_credits" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_ai_credits_user_id_idx" ON "tenant_ai_credits" USING btree ("user_id");
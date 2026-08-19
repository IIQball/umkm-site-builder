CREATE TYPE "public"."generic_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed', 'expired', 'canceled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'processing', 'completed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('superadmin', 'admin', 'designer', 'tenant');--> statement-breakpoint
CREATE TYPE "public"."store_status" AS ENUM('pending', 'active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."template_status" AS ENUM('draft', 'pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('store_registration', 'template_purchase');--> statement-breakpoint
CREATE TYPE "public"."wallet_mutation_type" AS ENUM('CREDIT', 'DEBIT');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"store_id" text,
	"action" text NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_whitelist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" "role" DEFAULT 'admin' NOT NULL,
	"added_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_whitelist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"designer_id" text NOT NULL,
	"bank_name" text NOT NULL,
	"account_number" text NOT NULL,
	"account_holder" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bank_accounts_designer_id_unique" UNIQUE("designer_id")
);
--> statement-breakpoint
CREATE TABLE "commissions" (
	"id" text PRIMARY KEY NOT NULL,
	"designer_id" text NOT NULL,
	"transaction_id" text NOT NULL,
	"template_id" text NOT NULL,
	"total_amount" bigint NOT NULL,
	"platform_fee" bigint NOT NULL,
	"designer_amount" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "commissions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "designers" (
	"user_id" text PRIMARY KEY NOT NULL,
	"portfolio_url" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payout_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"designer_id" text NOT NULL,
	"bank_account_id" text NOT NULL,
	"amount" bigint NOT NULL,
	"status" "payout_status" DEFAULT 'pending' NOT NULL,
	"xendit_payout_id" text,
	"gateway_reference" text,
	"gateway_message" text,
	"processed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payout_requests_xendit_payout_id_unique" UNIQUE("xendit_payout_id")
);
--> statement-breakpoint
CREATE TABLE "platform_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"platform_fee_percentage" integer DEFAULT 30 NOT NULL,
	"payout_minimum_balance" bigint DEFAULT 50000 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"category_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"base_price" bigint NOT NULL,
	"variants" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text,
	"image_urls" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "store_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subdomain" text NOT NULL,
	"user_id" text NOT NULL,
	"template_id" text NOT NULL,
	"wa_number" text NOT NULL,
	"google_maps_url" text,
	"is_registration_paid" boolean DEFAULT false NOT NULL,
	"status" "store_status" DEFAULT 'active' NOT NULL,
	"suspend_reason" text,
	"delete_reason" text,
	"customization" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"total_wa_clicks" integer DEFAULT 0 NOT NULL,
	"total_views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"thumbnail_url" text,
	"price" bigint DEFAULT 0 NOT NULL,
	"config" jsonb NOT NULL,
	"status" "template_status" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"delete_reason" text,
	"designer_id" text NOT NULL,
	"approved_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" bigint NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"store_id" text,
	"template_id" text,
	"external_id" text NOT NULL,
	"payment_gateway_ref" text,
	"payment_channel" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "transactions_payment_gateway_ref_unique" UNIQUE("payment_gateway_ref")
);
--> statement-breakpoint
CREATE TABLE "user_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"template_id" text NOT NULL,
	"acquired_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" "role" DEFAULT 'tenant' NOT NULL,
	"status" "generic_status" DEFAULT 'active' NOT NULL,
	"suspend_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet_mutations" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_id" text NOT NULL,
	"type" "wallet_mutation_type" NOT NULL,
	"amount" bigint NOT NULL,
	"balance_after" bigint NOT NULL,
	"description" text NOT NULL,
	"reference_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" text PRIMARY KEY NOT NULL,
	"designer_id" text NOT NULL,
	"balance" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallets_designer_id_unique" UNIQUE("designer_id")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_whitelist" ADD CONSTRAINT "admin_whitelist_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_designer_id_designers_user_id_fk" FOREIGN KEY ("designer_id") REFERENCES "public"."designers"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_designer_id_designers_user_id_fk" FOREIGN KEY ("designer_id") REFERENCES "public"."designers"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "designers" ADD CONSTRAINT "designers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_designer_id_designers_user_id_fk" FOREIGN KEY ("designer_id") REFERENCES "public"."designers"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_bank_account_id_bank_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_settings" ADD CONSTRAINT "platform_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_store_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."store_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_categories" ADD CONSTRAINT "store_categories_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_designer_id_designers_user_id_fk" FOREIGN KEY ("designer_id") REFERENCES "public"."designers"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_templates" ADD CONSTRAINT "user_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_templates" ADD CONSTRAINT "user_templates_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_mutations" ADD CONSTRAINT "wallet_mutations_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_designer_id_designers_user_id_fk" FOREIGN KEY ("designer_id") REFERENCES "public"."designers"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_store_id_idx" ON "products" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_slug_unique_idx" ON "products" USING btree ("store_id","slug");--> statement-breakpoint
CREATE INDEX "store_categories_store_id_idx" ON "store_categories" USING btree ("store_id");--> statement-breakpoint
CREATE UNIQUE INDEX "store_slug_unique_idx" ON "store_categories" USING btree ("store_id","slug");--> statement-breakpoint
CREATE INDEX "stores_subdomain_idx" ON "stores" USING btree ("subdomain");--> statement-breakpoint
CREATE UNIQUE INDEX "stores_user_id_unique_idx" ON "stores" USING btree ("user_id") WHERE "stores"."deleted_at" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "stores_subdomain_unique_idx" ON "stores" USING btree ("subdomain") WHERE "stores"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "transactions_user_id_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_status_idx" ON "transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "transactions_external_id_idx" ON "transactions" USING btree ("external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_template_unique_idx" ON "user_templates" USING btree ("user_id","template_id");
ALTER TYPE "public"."generic_status" ADD VALUE 'pending';--> statement-breakpoint
CREATE TABLE "business_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "template_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "template_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tenant_invitations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"otp_code" text,
	"invited_by" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "bank_accounts" RENAME COLUMN "designer_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "payout_requests" RENAME COLUMN "designer_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "wallets" RENAME COLUMN "designer_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_designer_id_unique";--> statement-breakpoint
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_designer_id_unique";--> statement-breakpoint
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_designer_id_designers_user_id_fk";
--> statement-breakpoint
ALTER TABLE "payout_requests" DROP CONSTRAINT "payout_requests_designer_id_designers_user_id_fk";
--> statement-breakpoint
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_designer_id_designers_user_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."transaction_type";--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('template_purchase');--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" SET DATA TYPE "public"."transaction_type" USING "type"::"public"."transaction_type";--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "google_maps_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "refresh_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD COLUMN "bank_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD COLUMN "is_primary" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "commissions" ADD COLUMN "admin_id" text;--> statement-breakpoint
ALTER TABLE "commissions" ADD COLUMN "admin_amount" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "platform_settings" ADD COLUMN "admin_service_fee" bigint DEFAULT 5000 NOT NULL;--> statement-breakpoint
ALTER TABLE "platform_settings" ADD COLUMN "settlement_delay_days" integer DEFAULT 7 NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "category_id" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "google_maps_embed_url" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "latitude" double precision;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "longitude" double precision;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "registered_by" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "last_edited_by" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "category_id" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "admin_fee" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "assisted_by" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "registered_by" text;--> statement-breakpoint
ALTER TABLE "wallets" ADD COLUMN "available_balance" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_invitations" ADD CONSTRAINT "tenant_invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "business_categories_slug_idx" ON "business_categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "template_categories_slug_idx" ON "template_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tenant_invitations_email_idx" ON "tenant_invitations" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_invitations_token_idx" ON "tenant_invitations" USING btree ("token");--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_requests" ADD CONSTRAINT "payout_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_category_id_business_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."business_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_registered_by_users_id_fk" FOREIGN KEY ("registered_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_last_edited_by_users_id_fk" FOREIGN KEY ("last_edited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_category_id_template_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."template_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_assisted_by_users_id_fk" FOREIGN KEY ("assisted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bank_accounts_user_id_idx" ON "bank_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bank_accounts_user_account_unique_idx" ON "bank_accounts" USING btree ("user_id","bank_code","account_number");--> statement-breakpoint
CREATE UNIQUE INDEX "bank_accounts_user_primary_idx" ON "bank_accounts" USING btree ("user_id") WHERE "bank_accounts"."is_primary" = true;--> statement-breakpoint
CREATE INDEX "commissions_admin_id_idx" ON "commissions" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "payout_requests_user_id_idx" ON "payout_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "stores_name_idx" ON "stores" USING btree ("name");--> statement-breakpoint
CREATE INDEX "stores_category_id_idx" ON "stores" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "stores_registered_by_idx" ON "stores" USING btree ("registered_by");--> statement-breakpoint
CREATE INDEX "stores_coordinates_idx" ON "stores" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "templates_category_id_idx" ON "templates" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "templates_slug_idx" ON "templates" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "transactions_assisted_by_idx" ON "transactions" USING btree ("assisted_by");--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "is_registration_paid";--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_unique" UNIQUE("user_id");
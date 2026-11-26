CREATE TYPE "public"."bug_report_source" AS ENUM('site_builder', 'landing_page');--> statement-breakpoint
CREATE TYPE "public"."bug_report_status" AS ENUM('unresolved', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TABLE "bug_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"source_app" "bug_report_source" DEFAULT 'site_builder' NOT NULL,
	"status" "bug_report_status" DEFAULT 'unresolved' NOT NULL,
	"title" text,
	"description" text NOT NULL,
	"steps_to_reproduce" text,
	"route_url" text NOT NULL,
	"user_agent" text NOT NULL,
	"reporter_email" text,
	"reporter_user_id" text,
	"reporter_role" text,
	"attachment_meta" jsonb,
	"admin_notes" text,
	"resolved_by" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tenant_ai_credits" ALTER COLUMN "balance" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "bug_reports" ADD CONSTRAINT "bug_reports_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bug_reports" ADD CONSTRAINT "bug_reports_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bug_reports_status_idx" ON "bug_reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bug_reports_source_app_idx" ON "bug_reports" USING btree ("source_app");--> statement-breakpoint
CREATE INDEX "bug_reports_created_at_idx" ON "bug_reports" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "bug_reports_status_created_at_idx" ON "bug_reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "bug_reports_reporter_user_id_idx" ON "bug_reports" USING btree ("reporter_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_generation_logs_is_testing_idx" ON "ai_generation_logs" USING btree ("is_testing");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_generation_logs_is_testing_created_at_idx" ON "ai_generation_logs" USING btree ("is_testing","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_generation_logs_tenant_id_created_at_idx" ON "ai_generation_logs" USING btree ("tenant_id","created_at");
CREATE INDEX IF NOT EXISTS "ai_generation_logs_is_testing_idx" ON "ai_generation_logs" USING btree ("is_testing");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_generation_logs_is_testing_created_at_idx" ON "ai_generation_logs" USING btree ("is_testing", "created_at");

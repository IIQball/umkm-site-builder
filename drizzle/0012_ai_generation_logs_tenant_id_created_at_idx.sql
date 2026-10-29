CREATE INDEX IF NOT EXISTS "ai_generation_logs_tenant_id_created_at_idx" ON "ai_generation_logs" USING btree ("tenant_id", "created_at");


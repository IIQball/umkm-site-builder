CREATE TABLE "ai_deposit_history" (
	"id" text PRIMARY KEY NOT NULL,
	"amount_usd" double precision NOT NULL,
	"amount_idr" bigint NOT NULL,
	"exchange_rate" integer NOT NULL,
	"description" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_deposit_history" ADD CONSTRAINT "ai_deposit_history_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_deposit_history_created_by_idx" ON "ai_deposit_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "ai_deposit_history_created_at_idx" ON "ai_deposit_history" USING btree ("created_at");
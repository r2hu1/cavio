CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"gemini" text DEFAULT '' NOT NULL,
	"groq" text DEFAULT '' NOT NULL,
	"openrouter" text DEFAULT '' NOT NULL,
	"active_provider" text DEFAULT '' NOT NULL,
	"chat_model" text DEFAULT '' NOT NULL,
	"copilot_model" text DEFAULT '' NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
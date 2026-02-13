ALTER TABLE "documents" ADD COLUMN "deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "folders" ADD COLUMN "deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "folders" ADD COLUMN "deleted_at" timestamp;
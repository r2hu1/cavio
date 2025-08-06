import type { Config } from "drizzle-kit";
import "dotenv/config";

console.log("DB URL:", process.env.DATABASE_URL);

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
} satisfies Config;

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "./schema";

const { Pool } = pkg;

declare global {
  var _drizzleDb: ReturnType<typeof drizzle> | undefined;
}

const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (!global._pgPool) global._pgPool = pool;

const db = global._drizzleDb ?? drizzle(pool, { schema });
if (!global._drizzleDb) global._drizzleDb = db;

export { db };

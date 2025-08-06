import type { Pool } from "pg";
import type { DrizzleD1Database } from "drizzle-orm/node-postgres";

declare global {
  var _pgPool: Pool | undefined;
  var _drizzleDb:
    | ReturnType<typeof import("drizzle-orm/node-postgres").drizzle>
    | undefined;
}

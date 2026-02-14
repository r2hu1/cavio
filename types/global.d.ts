import type { Pool } from "pg";

declare global {
	var _pgPool: Pool | undefined;
	var _drizzleDb:
		| ReturnType<typeof import("drizzle-orm/node-postgres").drizzle>
		| undefined;
}

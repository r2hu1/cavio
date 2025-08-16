import { db } from "@/db/client";
import { documents, folders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { isAuthenticated } from "@/lib/cache/auth";
import { polarClient } from "@/lib/polar";
import { MAX_FREE_DOCUMENTS, MAX_FREE_FOLDERS } from "@/modules/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
export const createTRPCContext = cache(async () => {
	/**
	 * @see: https://trpc.io/docs/server/context
	 */
	return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
	/**
	 * @see https://trpc.io/docs/server/data-transformers
	 */
	// transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
	const session = await isAuthenticated();
	if (!session) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "UNAUTHORIZED" });
	}
	return next({ ctx: { ...ctx, auth: session } });
});

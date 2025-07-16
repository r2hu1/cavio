import { db } from "@/db/client";
import { documents } from "@/db/schema";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { MAX_FREE_DOCUMENTS } from "@/modules/constants";
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, auth: session } });
});
export const premiumProcedure = () =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });
    const isPremium = customer.activeSubscriptions.length > 0;
    const [userDocuments] = await db
      .select({
        count: count(documents.id),
      })
      .from(documents)
      .where(eq(documents.userId, ctx.auth.user.id));
    const isFreeLimitReached = userDocuments.count >= MAX_FREE_DOCUMENTS;
    const shouldThroughError = isFreeLimitReached && !isPremium;
    if (shouldThroughError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "You have reached the free limit. Upgrade to premium to continue.",
      });
    }
    return next({ ctx: { ...ctx, customer } });
  });

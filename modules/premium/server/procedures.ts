import { db } from "@/db/client";
import { documents } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { count, eq } from "drizzle-orm";

export const premiumRouter = createTRPCRouter({
  getActiveSubscription: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });
    const subscriptions = customer.activeSubscriptions[0];
    if (!subscriptions) return false;
    return {
      ...subscriptions,
    };
  }),
  getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });
    const subscriptions = customer.activeSubscriptions[0];
    if (subscriptions) return null;

    const [userDocuments] = await db
      .select({
        count: count(documents.id),
      })
      .from(documents)
      .where(eq(documents.userId, ctx.auth.user.id));

    return {
      documentsCount: userDocuments.count,
    };
  }),
});

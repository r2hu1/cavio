import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

const premiumCache = new Map<string, { status: boolean; expiresAt: number }>();

export async function isSubscribed() {
  const cached = premiumCache.get("premium");
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.status;
  }

  const caller = appRouter.createCaller(await createTRPCContext());
  const currSub = await caller.premium.getActiveSubscription();
  const isPremium = !!currSub;

  premiumCache.set("premium", {
    status: isPremium,
    expiresAt: now + 5 * 60 * 1000,
  });

  return isPremium;
}

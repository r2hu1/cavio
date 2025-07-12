"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function SubscriptionInfo() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.premium.getActiveSubscription.queryOptions(),
  );

  if (!isLoading) {
    console.log(data);
  }
  return (
    <div>
      {/* <h2>Premium Info</h2>
      {subscription ? (
        <pre>{JSON.stringify(subscription, null, 2)}</pre>
      ) : (
        <p>No active subscription.</p>
      )}

      <h3>Free Usage</h3>
      <pre>{JSON.stringify(freeUsage, null, 2)}</pre> */}
    </div>
  );
}

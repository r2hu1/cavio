import PricingView from "@/modules/pricing/views/ui";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function UpgradePage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.premium.getProducts.queryOptions());
  void queryClient.prefetchQuery(
    trpc.premium.getCurrentSubscription.queryOptions(),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <ErrorBoundary fallback={<div>Error</div>}>
          <PricingView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}

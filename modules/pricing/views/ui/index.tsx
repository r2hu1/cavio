"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Pricing } from "./pricing-view";

export default function PricingView() {
  const trpc = useTRPC();
  const { data: subscription, isLoading } = useQuery(
    trpc.premium.getCurrentSubscription.queryOptions(),
  );
  const { data: products, isLoading: productsLoading } = useQuery(
    trpc.premium.getProducts.queryOptions(),
  );
  if (!productsLoading) {
    console.log(products);
  }
  return (
    <div className="space-y-10">
      <Pricing
        currentPlan={
          !isLoading && subscription?.name != null ? subscription.name : "Free"
        }
        productId={[products?.[0]?.id ?? "", products?.[1]?.id ?? ""]}
      />
    </div>
  );
}

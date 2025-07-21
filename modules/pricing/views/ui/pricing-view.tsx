"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export function Pricing() {
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();
  const [selectedPlan, setSelectedPlan] = useState<string | null>("yearly");

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery(
    trpc.premium.getCurrentSubscription.queryOptions(),
  );

  const { data: products, isLoading: isProductsLoading } = useQuery(
    trpc.premium.getProducts.queryOptions(),
  );

  const handleCheckout = async () => {
    if (!isLoadingSubscription && subscription?.name) {
      return await authClient.customer.portal();
    }
    if (isProductsLoading) return;
    setLoading(true);
    const selectedProductId =
      selectedPlan === "yearly" ? products![1].id : products![0].id;
    await authClient.checkout({
      products: [selectedProductId],
    });
    setLoading(false);
  };
  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">
            $<span>{selectedPlan === "yearly" ? 6.67 : 8}</span>
            <span className="text-sm ml-1 text-foreground/80">/ month</span>
          </h1>
          <div className="flex items-center gap-2">
            <Label htmlFor="based" className="text-xs text-foreground/70">
              Paid {selectedPlan === "yearly" ? "Yearly" : "Monthly"}
            </Label>
            <Switch
              id="based"
              className="cursor-pointer"
              defaultChecked
              onCheckedChange={(checked) =>
                setSelectedPlan(checked ? "yearly" : "monthly")
              }
            />
          </div>
        </div>
        <div className="text-left -mt-1">
          <Features />
        </div>
        <div className="flex items-center justify-end -mb-4">
          <Button
            disabled={isLoadingSubscription || loading}
            onClick={handleCheckout}
          >
            {!isLoadingSubscription
              ? !subscription?.name
                ? "Continue To Upgrade"
                : "Manage Subscription"
              : "Please Wait"}
          </Button>
        </div>
      </div>
    </div>
  );
}
const Features = () => (
  <div className="mt-2.5 grid gap-1.5 text-left !w-fit">
    <p className="text-sm text-foreground/80">+ Unlimited AI usage.</p>
    <p className="text-sm text-foreground/80">+ Unlimited folders.</p>
    <p className="text-sm text-foreground/80">
      + Unlimited files and documents.
    </p>
    <p className="text-sm text-foreground/80">+ Host documents as website.</p>
    <p className="text-sm text-foreground/90">
      + Access to all other features.
    </p>
  </div>
);

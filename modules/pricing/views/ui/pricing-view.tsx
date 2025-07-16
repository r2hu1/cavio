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
    setLoading(true);
    if (isProductsLoading) return;
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
        <Badge variant="secondary" className="text-sm h-8 px-4">
          <h1>
            You are on{" "}
            <span className="text-indigo-400">
              {!isLoadingSubscription &&
                (subscription?.name ? subscription.name : "Free")}
            </span>{" "}
            Plan
          </h1>
        </Badge>
        <RadioGroup
          onValueChange={(e) => {
            setSelectedPlan(e);
          }}
          defaultValue="yearly"
        >
          <Label
            htmlFor="monthly"
            className={cn(
              "bg-card border rounded-lg p-4 flex items-center justify-between",
              selectedPlan == "monthly" && "bg-secondary border-1 border-ring",
            )}
          >
            <div>
              <div className="flex items-center w-fit gap-2">
                <h1 className="text-xl font-bold">$8 /mo</h1>
                <Badge variant="outline">Billed Monthly</Badge>
              </div>
              <Features />
            </div>
            <RadioGroupItem value="monthly" id="monthly" />
          </Label>
          <Label
            htmlFor="yearly"
            className={cn(
              "bg-card border rounded-lg p-4 flex items-center justify-between",
              selectedPlan == "yearly" && "bg-secondary border-1 !border-ring",
            )}
          >
            <div className="w-full">
              <div className="flex items-center w-fit gap-2">
                <h1 className="text-xl font-bold">$6.67 /mo</h1>
                <Badge variant="outline">Billed Yearly</Badge>
                <Badge>16.7% off</Badge>
              </div>
              <Features />
            </div>
            <RadioGroupItem value="yearly" id="yearly" />
          </Label>
        </RadioGroup>
        <div className="flex items-center justify-end -mb-4">
          <Button onClick={handleCheckout}>
            {!isLoadingSubscription &&
              (!subscription?.name
                ? "Continue To Upgrade"
                : "Manage Subscription")}
          </Button>
        </div>
      </div>
    </div>
  );
}
const Features = () => (
  <div className="mt-2.5 sm:space-x-3 grid gap-1 sm:grid-cols-2 text-left !w-fit">
    <p className="text-sm text-foreground/80">• Unlimited AI completions</p>
    <p className="text-sm text-foreground/80">• Unlimited folders</p>
    <p className="text-sm text-foreground/80">• Unlimited files</p>
    <p className="text-sm text-foreground/80">• Unlimited AI chat</p>
    <p className="text-sm text-foreground/80">• Host documents as websites</p>
    <p className="text-sm text-foreground/80">
      • Access to all other features.
    </p>
  </div>
);

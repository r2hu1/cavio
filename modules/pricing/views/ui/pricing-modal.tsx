"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function PricingModal({
  children,
}: {
  children?: React.ReactNode;
}) {
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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="text-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="!h-4 !w-5" />
            Upgrade To Premium
          </DialogTitle>
          <DialogDescription>
            Upgrade and enjoy all the benefits of premium plan. Cancel or pause
            at any time. Enjoy!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-2 -mb-1">
          <div className="px-4 border py-4 rounded-lg space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-extrabold text-3xl">
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
            <div className="text-left -mt-2">
              <div className="grid gap-1.5 text-left !w-fit">
                <p className="text-sm text-foreground/80">
                  + Unlimited AI usage.
                </p>
                <p className="text-sm text-foreground/80">
                  + Unlimited folders.
                </p>
                <p className="text-sm text-foreground/80">
                  + Unlimited files and documents.
                </p>
                <p className="text-sm text-foreground/80">
                  + Host documents as website.
                </p>
                <p className="text-sm text-foreground/90">
                  + Access to all other features.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Now now</Button>
            </DialogClose>
            <Button
              disabled={isLoadingSubscription || loading}
              onClick={handleCheckout}
            >
              {!isLoadingSubscription ? (
                !subscription?.name ? (
                  "Upgrade"
                ) : (
                  "Manage"
                )
              ) : (
                <Loader2 className="!h-4 !w-4 animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

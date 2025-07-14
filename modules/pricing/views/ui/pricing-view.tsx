"use client";
import React, { useState } from "react";
import { PlusIcon, ShieldCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BorderTrail } from "@/components/ui/border-trail";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export function Pricing({
  productId,
  currentPlan,
}: {
  productId: string[];
  currentPlan: string;
}) {
  const [loading, setLoading] = useState(false);

  const trpc = useTRPC();
  const { data: activeSubscription, isLoading } = useQuery(
    trpc.premium.getActiveSubscription.queryOptions(),
  );

  const handleCheckout = async (id: string) => {
    setLoading(true);
    await authClient.checkout({
      products: [id],
    });
    setLoading(false);
  };
  return (
    <section className="relative overflow-hidden">
      <div id="pricing" className="mx-auto w-full max-w-7xl space-y-5 px-4">
        <div className="mx-auto max-w-xl space-y-5">
          <h2 className="mt-5 text-center text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl">
            You are on <span className="text-indigo-700">{currentPlan}</span>{" "}
            plan
          </h2>
          <p className="text-muted-foreground mt-5 text-center text-sm md:text-base">
            Access to all features and services, including unlimited access to
            our AI features, priority support, and more.
          </p>
        </div>

        <div className="relative">
          <div
            className={cn(
              "z--10 hidden pointer-events-none absolute inset-0 size-full",
              "bg-[linear-gradient(to_right,--theme(--color-foreground/.2)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.2)_1px,transparent_1px)]",
              "bg-[size:32px_32px]",
              "[mask-image:radial-gradient(ellipse_at_center,var(--background)_10%,transparent)]",
            )}
          />

          <Card className="max-w-4xl mx-auto">
            <CardContent className="grid md:grid-cols-2 w-full space-y-2">
              <div className="w-full px-4 pt-5 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="leading-none font-semibold">Monthly</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Best value for growing individuals!
                  </p>
                </div>
                <div className="mt-10 space-y-4">
                  <div className="text-muted-foreground flex items-end gap-0.5 text-xl">
                    <span>$</span>
                    <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                      8
                    </span>
                    <span>/month</span>
                  </div>
                  <div>
                    <ul className="text-base list-disc list-inside px-2 text-foreground/80 grid gap-1 py-5">
                      <li>Unlimited AI completion</li>
                      <li>Unlimited AI chat</li>
                      <li>Share as webpage</li>
                      <li>Unlimited folders</li>
                      <li>Unlimited documents</li>
                      <li>Unlimited storage</li>
                      <li>... and many more!</li>
                    </ul>
                  </div>
                  {!isLoading && !activeSubscription ? (
                    <Button
                      onClick={() => {
                        handleCheckout(productId[0]);
                      }}
                      disabled={!productId[0] || loading}
                      className="w-full"
                      variant="outline"
                    >
                      Get Started
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => authClient.customer.portal()}
                    >
                      Manage
                    </Button>
                  )}
                </div>
              </div>
              <div className="relative w-full rounded-lg border bg-secondary px-4 pt-5 pb-4">
                <BorderTrail
                  style={{
                    boxShadow:
                      "0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)",
                  }}
                  size={100}
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="leading-none font-semibold">Yearly</h3>
                    <div className="flex items-center gap-x-1">
                      <span className="text-muted-foreground text-sm line-through">
                        $8
                      </span>
                      <Badge>16.67% off</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Unlock savings with an annual subscription!
                  </p>
                </div>
                <div className="mt-10 space-y-4">
                  <div className="text-muted-foreground flex items-end text-xl">
                    <span>$</span>
                    <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                      6.99
                    </span>
                    <span>/month</span>
                  </div>
                  <div>
                    <ul className="text-base list-disc list-inside px-2 text-foreground/80 grid gap-1 py-5">
                      <li>Unlimited AI completion</li>
                      <li>Unlimited AI chat</li>
                      <li>Share as webpage</li>
                      <li>Unlimited folders</li>
                      <li>Unlimited documents</li>
                      <li>Unlimited storage</li>
                      <li>... and many more!</li>
                    </ul>
                  </div>
                  {!isLoading && !activeSubscription ? (
                    <Button
                      onClick={() => {
                        handleCheckout(productId[1]);
                      }}
                      disabled={!productId[1] || loading}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => authClient.customer.portal()}
                    >
                      Manage
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-muted-foreground flex items-center justify-center gap-x-2 text-sm">
              <ShieldCheckIcon className="size-4" />
              <span>
                Access to all other features with no hidden fees, cancel
                anytime!
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

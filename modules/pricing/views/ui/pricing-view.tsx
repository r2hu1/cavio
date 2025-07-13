"use client";
import React from "react";
import { PlusIcon, ShieldCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BorderTrail } from "@/components/ui/border-trail";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { polarClient } from "@/lib/polar";

export function Pricing({
  productId,
  currentPlan,
}: {
  productId: string[];
  currentPlan: string;
}) {
  const handleCheckout = async (id: string) => {
    const e = await authClient.checkout({
      products: [id],
      fetchOptions: {
        disableValidation: true,
      },
    });
    console.log(e.data?.url);
    console.log(e.error?.message);
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
            We offer a single price for all our services. We believe that
            pricing is a critical component of any successful business.
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

          <div className="mx-auto w-full max-w-4xl space-y-2">
            <div className="grid md:grid-cols-2 bg-background relative border p-4">
              <PlusIcon className="absolute -top-3 -left-3  size-5.5" />
              <PlusIcon className="absolute -top-3 -right-3 size-5.5" />
              <PlusIcon className="absolute -bottom-3 -left-3 size-5.5" />
              <PlusIcon className="absolute -right-3 -bottom-3 size-5.5" />

              <div className="w-full px-4 pt-5 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="leading-none font-semibold">Monthly</h3>
                    <div className="flex items-center gap-x-1">
                      <span className="text-muted-foreground text-sm line-through">
                        $10
                      </span>
                      <Badge variant="secondary">20% off</Badge>
                    </div>
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
                  <Button
                    onClick={() => {
                      handleCheckout(productId[0]);
                    }}
                    disabled={!productId[0]}
                    className="w-full"
                    variant="outline"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
              <div className="relative w-full rounded-lg border px-4 pt-5 pb-4">
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
                    Unlock savings with an annual commitment!
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
                  <Button
                    onClick={() => {
                      handleCheckout(productId[1]);
                    }}
                    disabled={!productId[1]}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-muted-foreground flex items-center justify-center gap-x-2 text-sm">
              <ShieldCheckIcon className="size-4" />
              <span>Access to all features with no hidden fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

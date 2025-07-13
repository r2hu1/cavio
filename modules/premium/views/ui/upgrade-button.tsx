"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { polarClient } from "@/lib/polar";
import { VariantProps } from "class-variance-authority";

export default function UpgradeButton({
  className,
  children,
  size = "default",
  asChild,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  return (
    <Button
      asChild={asChild}
      className={className}
      size={size}
      onClick={async () => {
        authClient.checkout({
          products: ["41361670-74b3-4d08-981e-e9d4290e8114"],
        });
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

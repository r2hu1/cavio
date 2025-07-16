import { Button, buttonVariants } from "@/components/ui/button";
import PricingModal from "@/modules/pricing/views/ui/pricing-modal";
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
    <PricingModal>
      <Button asChild={asChild} className={className} size={size} {...props}>
        {children}
      </Button>
    </PricingModal>
  );
}

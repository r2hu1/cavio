import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import Link from "next/link";

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
    <Link href="/pro">
      <Button asChild={asChild} className={className} size={size} {...props}>
        {children}
      </Button>
    </Link>
  );
}

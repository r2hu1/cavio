"use client";
import { Slot } from "@radix-ui/react-slot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pricing } from "./pricing-view";

export default function PricingModal({
  children,
}: {
  children?: React.ReactNode;
}) {
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
          <div className="py-4 mt-1">
            <Pricing />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function UpgradeButton() {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        window.open("https://example.com/upgrade", "_blank");
      }}
    >
      Upgrade
    </Button>
  );
}

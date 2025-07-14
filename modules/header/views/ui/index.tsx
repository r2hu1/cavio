"use client";
import { ModeToggle } from "@/components/theme-switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UpgradeButton from "@/modules/premium/views/ui/upgrade-button";
import { Sparkles } from "lucide-react";
import Breadcrumbs from "./breadcrumbs";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function DashboardHeader() {
  const trpc = useTRPC();
  const { data: subscription, isLoading: subscriptionLoading } = useQuery(
    trpc.premium.getCurrentSubscription.queryOptions(),
  );
  return (
    <header className="px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-2">
        {!subscriptionLoading && !subscription ? (
          <UpgradeButton>
            Upgrade <Sparkles className="h-3 w-3" />
          </UpgradeButton>
        ) : null}
        <ModeToggle />
      </div>
    </header>
  );
}

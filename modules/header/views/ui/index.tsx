"use client";
import { ModeToggle } from "@/components/theme-switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UpgradeButton from "@/modules/premium/views/ui/upgrade-button";
import { Sparkles } from "lucide-react";
import Breadcrumbs from "./breadcrumbs";

export default function DashboardHeader() {
  return (
    <header className="px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Breadcrumbs />
      </div>
    </header>
  );
}

"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Breadcrumbs from "./breadcrumbs";
import { ModeToggle } from "@/components/theme-switcher";
import DynamicNav from "./dynamic-nav";
import Tooltip from "@/components/ui/tooltip-v2";

export default function DashboardHeader() {
  const { open } = useSidebar();
  return (
    <header className="px-4 h-14 flex items-center gap-2">
      {!open && <SidebarTrigger />}
      <DynamicNav />
    </header>
  );
}

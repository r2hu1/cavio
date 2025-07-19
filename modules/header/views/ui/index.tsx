"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumbs from "./breadcrumbs";
import { ModeToggle } from "@/components/theme-switcher";

export default function DashboardHeader() {
  return (
    <header className="px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        {/* <Breadcrumbs /> */}
      </div>
      <ModeToggle />
    </header>
  );
}

"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumbs from "./breadcrumbs";
import { ModeToggle } from "@/components/theme-switcher";
import DynamicNav from "./dynamic-nav";

export default function DashboardHeader() {
  return (
    <header className="px-4 h-14 flex items-center gap-2">
      <SidebarTrigger />
      <DynamicNav />
    </header>
  );
}

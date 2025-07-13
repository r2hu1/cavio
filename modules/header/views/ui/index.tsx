import { ModeToggle } from "@/components/theme-switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UpgradeButton from "@/modules/premium/views/ui/upgrade-button";
import { Sparkles } from "lucide-react";
import Breadcrumbs from "./breadcrumbs";

export default function DashboardHeader() {
  return (
    <header className="px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {/* <Breadcrumbs /> */}
      </div>
      <div className="flex items-center gap-2">
        <UpgradeButton>
          Upgrade <Sparkles className="h-3 w-3" />
        </UpgradeButton>
        <ModeToggle />
      </div>
    </header>
  );
}

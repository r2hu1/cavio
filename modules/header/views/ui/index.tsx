import SharedLogo from "@/components/shared-logo";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardHeader() {
  return (
    <header className="px-6 h-16 flex items-center justify-between">
      <SidebarTrigger />
      <div className="flex items-center gap-3">
        <Button asChild>
          <RainbowButton>Upgrade</RainbowButton>
        </Button>
      </div>
    </header>
  );
}

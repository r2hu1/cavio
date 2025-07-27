import { ModeToggle } from "@/components/theme-switcher";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SignOut from "@/modules/auth/views/ui/sign-out";
import { Bolt, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function DashboardSidebarFooter() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/account" className="text-foreground/80">
            <User className="!h-4 !w-4" /> Account
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/settings" className="text-foreground/80">
            <Bolt className="!h-4 !w-4" />
            Settings
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <div className="flex w-full gap-2">
        <SidebarMenuItem className="w-full">
          <SidebarMenuButton asChild>
            <SignOut
              variant="link"
              className="!text-left w-full flex items-center justify-start !px-2 text-sm text-foreground/80"
            >
              <LogOut className="!h-4 !w-4" /> Logout
            </SignOut>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <SidebarTrigger />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </div>
    </SidebarMenu>
  );
}

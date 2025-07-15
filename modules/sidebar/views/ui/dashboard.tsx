import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HomeIcon, Search } from "lucide-react";
import Link from "next/link";

export default function DashboardNav() {
  return (
    <SidebarGroup className="mt-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={"Search"}>
            <Search className="h-4 !w-4" /> Search
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={"Home"}>
            <Link href="/">
              <HomeIcon className="h-4 !w-4" /> Home
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

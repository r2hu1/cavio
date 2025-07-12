import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Command } from "lucide-react";
import DashboardSidebarHeader from "./header";
import { NavUser } from "./user";
import Useage from "./useage";

export function DashboardSidebar() {
  return (
    <Sidebar variant="inset">
      <DashboardSidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <Useage />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

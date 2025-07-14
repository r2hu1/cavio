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
import { Folders } from "./folders";

export function DashboardSidebar() {
  return (
    <Sidebar variant="inset">
      <DashboardSidebarHeader />
      <SidebarContent>
        <Folders />
      </SidebarContent>
      <SidebarFooter>
        <Useage />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

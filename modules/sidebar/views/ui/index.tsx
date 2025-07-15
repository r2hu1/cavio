import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import DashboardSidebarHeader from "./header";
import { NavUser } from "./user";
import Useage from "./useage";
import { Folders } from "./folders";
import DashboardNav from "./dashboard";

export function DashboardSidebar() {
  return (
    <Sidebar variant="inset">
      <DashboardSidebarHeader />
      <SidebarContent className="hidden_scrollbar">
        <DashboardNav />
        <Folders />
      </SidebarContent>
      <SidebarFooter>
        <Useage />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

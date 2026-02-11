import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./user";
import { Folders } from "./folders";
import DashboardNav from "./dashboard";
import DashboardSidebarFooter from "./footer";

export function DashboardSidebar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="px-2">
        <NavUser />
      </SidebarHeader>
      <SidebarContent className="hidden_scrollbar px-2">
        <DashboardNav />
        <Folders />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <DashboardSidebarFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

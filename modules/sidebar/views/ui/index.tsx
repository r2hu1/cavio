import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import DashboardNav from "./dashboard";
import { Folders } from "./folders";
import DashboardSidebarFooter from "./footer";
import { NavUser } from "./user";

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

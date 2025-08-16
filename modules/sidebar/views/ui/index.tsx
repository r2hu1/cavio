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
			<SidebarHeader>
				<NavUser />
			</SidebarHeader>
			<SidebarContent className="hidden_scrollbar">
				<DashboardNav />
				<Folders />
			</SidebarContent>
			<SidebarFooter>
				<DashboardSidebarFooter />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

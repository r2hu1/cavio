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
			<div className="flex w-full gap-2">
				<SidebarMenuItem className="w-full">
					<SidebarMenuButton asChild>
						<Link href="/settings" className="text-foreground/80">
							<Bolt className="!h-4 !w-4" />
							Settings
						</Link>
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

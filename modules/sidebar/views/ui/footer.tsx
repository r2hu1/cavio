import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bolt, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DashboardSidebarFooter() {
	return (
		<SidebarMenu>
			<div className="flex flex-col w-full gap-2">
				<SidebarMenuItem className="w-full">
					<SidebarMenuButton asChild>
						<Link href="/bin" className="text-foreground/80">
							<Trash2 className="!h-4 !w-4" />
							Bin
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
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
			</div>
		</SidebarMenu>
	);
}

"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import DynamicNav from "./dynamic-nav";

export default function DashboardHeader() {
	const { open } = useSidebar();
	return (
		<div className="mb-14">
			<header
				className={cn(
					"px-4 h-14 flex items-center gap-2 transition-all right-0 z-50 fixed top-0 w-full",
					open && "md:w-[calc(100%-260px)]",
				)}
			>
				{!open && <SidebarTrigger />}
				<div className="flex md:hidden">
					<SidebarTrigger />
				</div>
				<DynamicNav />
			</header>
		</div>
	);
}

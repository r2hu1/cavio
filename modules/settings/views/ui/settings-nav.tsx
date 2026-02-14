"use client";

import { ModeToggle } from "@/components/theme-switcher";
import SignOut from "@/modules/auth/views/ui/sign-out";
import { LogOut } from "lucide-react";

export default function SettingsNav({ path }: { path: any }) {
	return (
		<div className="flex items-center justify-between">
			<h1 className="text-sm">
				{path.length <= 1
					? path[0].charAt(0).toUpperCase() + path[0].slice(1)
					: path[1].charAt(0).toUpperCase() + path[1].slice(1)}
			</h1>
			<div className="flex items-center gap-2">
				<SignOut variant="default" size="sm">
					Logout <LogOut className="!h-3.5 !w-3.5" />
				</SignOut>
				<ModeToggle />
			</div>
		</div>
	);
}

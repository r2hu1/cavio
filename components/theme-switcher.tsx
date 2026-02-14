"use client";
import { Button } from "@/components/ui/button";
import { Contrast } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
	const { setTheme, resolvedTheme } = useTheme();

	return (
		<Button
			variant="secondary"
			onClick={() => {
				setTheme(resolvedTheme == "dark" ? "light" : "dark");
			}}
			size="icon"
			className="h-8 w-8"
		>
			<Contrast className="!h-3.5 !w-3.5" />
		</Button>
	);
}

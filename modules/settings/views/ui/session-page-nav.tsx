"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const tabs = [
	{ label: "Account", href: "/settings" },
	// { label: "Subscriptions", href: "/settings/subscriptions" },
	{ label: "Preferences", href: "/settings/preferences" },
	{ label: "Sessions", href: "/settings/sessions" },
	{ label: "Danger", href: "/settings/danger" },
];

export default function SessionPageNav({ active }: { active: string }) {
	return (
		<div className="flex space-x-8 mb-8 border-b sm:overflow-auto overflow-x-scroll">
			{tabs.map((tab) => (
				<Link
					key={tab.label}
					href={tab.href}
					className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
						active === tab.label.toLowerCase()
							? "border-primary text-primary"
							: "border-transparent text-muted-foreground hover:text-foreground"
					}`}
				>
					{tab.label}
				</Link>
			))}
		</div>
	);
}

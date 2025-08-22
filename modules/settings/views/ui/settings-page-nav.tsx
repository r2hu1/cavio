"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const tabs = [
	{ label: "Account", href: "/settings" },
	{ label: "Preferences", href: "/settings/preferences" },
	{ label: "Sessions", href: "/settings/sessions" },
	{ label: "Danger", href: "/settings/danger" },
];

export default function SessionPageNav({ active }: { active: string }) {
	const [indicatorStyle, setIndicatorStyle] = useState<{
		width: number;
		left: number;
	} | null>(null);

	const handleHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
		if (parentRect) {
			setIndicatorStyle({
				width: rect.width,
				left: rect.left - parentRect.left,
			});
		}
	};

	const handleLeave = () => {
		// Reset to active tab
		const activeEl = document.querySelector(`[data-active="true"]`);
		if (activeEl) {
			const rect = activeEl.getBoundingClientRect();
			const parentRect = activeEl.parentElement?.getBoundingClientRect();
			if (parentRect) {
				setIndicatorStyle({
					width: rect.width,
					left: rect.left - parentRect.left,
				});
			}
		}
	};

	// On mount, set to active tab
	useEffect(() => {
		const activeEl = document.querySelector(`[data-active="true"]`);
		if (activeEl) {
			const rect = activeEl.getBoundingClientRect();
			const parentRect = activeEl.parentElement?.getBoundingClientRect();
			if (parentRect) {
				setIndicatorStyle({
					width: rect.width,
					left: rect.left - parentRect.left,
				});
			}
		}
	}, []);

	return (
		<div
			className="flex space-x-8 mb-8 border-b sm:overflow-auto overflow-x-scroll relative"
			onMouseLeave={handleLeave}
		>
			{tabs.map((tab) => (
				<Link
					key={tab.label}
					href={tab.href}
					onMouseEnter={handleHover}
					data-active={active === tab.label.toLowerCase()}
					className={`py-2 px-1 z-10 font-medium text-sm transition-colors ${
						active === tab.label.toLowerCase()
							? "text-primary"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					{tab.label}
				</Link>
			))}

			{indicatorStyle && (
				<div
					className="absolute bottom-0 h-[2px] bg-primary transition-all duration-300 ease-in-out"
					style={{
						width: indicatorStyle.width,
						left: indicatorStyle.left,
					}}
				/>
			)}
		</div>
	);
}

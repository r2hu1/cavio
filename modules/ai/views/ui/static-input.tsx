"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import useAutoResizeTextarea from "@/hooks/use-auto-resize-textarea";
import { cn } from "@/lib/utils";
import PricingModal from "@/modules/pricing/views/ui/pricing-modal";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAiChatInputState } from "../providers/input-provider";

export default function StaticInput() {
	const trpc = useTRPC();
	const { data, isPending } = useQuery(
		trpc.premium.getCurrentSubscription.queryOptions(),
	);

	const { adjustHeight, textareaRef } = useAutoResizeTextarea({
		minHeight: 80,
		maxHeight: 200,
	});
	const [value, setValue] = useState("");
	const [mode, setMode] = useState<"chat" | "build" | "research">("chat");

	const {
		setValue: setStateValue,
		setMode: setStateMode,
		pending,
		setSubmitted,
		value: stateValue,
	} = useAiChatInputState();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (pending) return;
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (value.trim()) {
				setStateValue(value);
				setSubmitted(true);
				setStateMode(mode);
				setValue("");
			}
		}
	};

	const handleClick = () => {
		if (pending) return;
		if (value.trim()) {
			setStateValue(value);
			setStateMode(mode);
			setSubmitted(true);
			setValue("");
		}
	};

	const { open } = useSidebar();

	useEffect(() => {
		setValue(stateValue);
	}, [stateValue]);

	return (
		<div
			className={cn(
				"p-3 bottom-0 fixed w-full sm:max-w-4xl mx-auto right-0 left-0 transition-all",
				open && "md:left-64 transition-all",
			)}
		>
			<div className="relative bg-sidebar dark:bg-card border rounded-xl shadow-lg">
				<Textarea
					ref={textareaRef}
					value={value}
					onChange={(e) => {
						setValue(e.target.value);
						adjustHeight();
					}}
					onKeyDown={handleKeyDown}
					placeholder={"Type something here..."}
					className="w-full px-4 py-3 resize-none bg-transparent border-none dark:text-white text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-neutral-500 placeholder:text-sm min-h-[70px]"
				/>
				<div className="px-3 pb-2.5">
					<div className="flex items-center justify-between w-full gap-2">
						<div className="flex gap-1 px-1 items-center">
							<Button
								variant={mode === "chat" ? "default" : "secondary"}
								onClick={() => {
									setMode("chat");
								}}
								size="sm"
								className="cursor-pointer text-xs h-6 shadow-none"
							>
								Chat
							</Button>
							{!isPending && data ? (
								<Button
									variant={mode === "build" ? "default" : "secondary"}
									onClick={() => {
										setMode("build");
									}}
									size="sm"
									className="cursor-pointer h-6 text-xs shadow-none"
								>
									Build
								</Button>
							) : (
								<PricingModal>
									<Button
										variant={"secondary"}
										size="sm"
										className="cursor-pointer h-6 text-xs shadow-none"
										disabled={isPending}
									>
										Build
									</Button>
								</PricingModal>
							)}
							{!isPending && data ? (
								<Button
									variant={mode === "research" ? "default" : "secondary"}
									onClick={() => {
										setMode("research");
									}}
									size="sm"
									className="cursor-pointer h-6 text-xs shadow-none"
								>
									Research
								</Button>
							) : (
								<PricingModal>
									<Button
										variant={"secondary"}
										size="sm"
										className="cursor-pointer h-6 text-xs shadow-none"
										disabled={isPending}
									>
										Research
									</Button>
								</PricingModal>
							)}
						</div>
						<Button
							size="sm"
							className="h-8 border flex items-center"
							variant={value.trim() ? "default" : "outline"}
							disabled={pending}
							onClick={handleClick}
						>
							Send
							{!pending ? (
								<ArrowUpIcon className="!h-4 !w-4" />
							) : (
								<Loader2 className="!h-4 !w-4 animate-spin" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAiChatInputState } from "../providers/input-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { UserChatBlock } from "./user-chat-block";
import { Brain, Copy, Download, FileText } from "lucide-react";
import Tooltip from "@/components/ui/tooltip-v2";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/ui/markdown-content";

const thinkingTexts = ["Thinking", "Researching", "Organizing", "Summarizing"];

export default function NewChatPageView({ params }: { params?: string }) {
	const router = useRouter();

	const {
		value: stateValue,
		mode: stateMode,
		setValue: stateSetValue,
		setMode: setStateMode,
		setPending: setStatePending,
		setSubmitted,
		submitted,
	} = useAiChatInputState();

	const trpc = useTRPC();
	const { mutate, data, error, isPending } = useMutation(
		trpc.ai.create.mutationOptions({}),
	);

	const [history, setHistory] = useState<{ role: string; content: string }[]>([
		{
			role: "ai",
			content: "",
		},
		{
			role: "user",
			content: "",
		},
	]);

	const queryClient = useQueryClient();
	const handleReq = async () => {
		if (!stateValue) return;
		if (isPending) return;
		setStatePending(true);
		setHistory((prev) => [...prev, { role: "user", content: stateValue }]);
		mutate(
			{
				content: stateValue,
				typeOfModel: stateMode,
				chatId: params,
			},
			{
				onError: (error) => {
					toast.error(error.message);
				},
				onSuccess: async (data) => {
					setHistory((prev) => [
						...prev,
						{ role: "ai", content: data.text as string },
					]);
					if (data?.id) {
						stateSetValue("");
						router.push(`/chat/${data.id}`);
					}
					await queryClient.invalidateQueries(trpc.ai.history.queryOptions());
				},
				onSettled: () => {
					setStatePending(false);
				},
			},
		);
	};
	useEffect(() => {
		if (stateValue && submitted && !isPending) {
			handleReq();
			setSubmitted(false);
		}
	}, [stateValue, submitted, isPending]);

	const [aiThinkingIndex, setAiThinkingIndex] = useState(0);

	useEffect(() => {
		if (!isPending) return;
		const interval = setInterval(() => {
			setAiThinkingIndex((prev) => (prev + 1) % thinkingTexts.length);
		}, 1500);
		return () => clearInterval(interval);
	}, [isPending]);

	return (
		<div className="max-w-3xl mx-auto pb-60">
			{!isPending && !submitted && !data && (
				<div className="flex items-center mt-10 justify-center gap-2">
					<div className="grid gap-6">
						<h1 className="text-center text-xl sm:text-3xl font-medium">
							Whats on your mind today?
						</h1>
					</div>
				</div>
			)}
			<div className="flex flex-col gap-14">
				{history.map((item, index) => {
					if (!item.content) return null;
					if (item.role === "ai") {
						return (
							<div
								key={index}
								className="prose prose-sm max-w-none dark:prose-invert
                  prose-headings:text-foreground
                  prose-p:text-foreground/90
                  prose-p:sm:text-base
                  prose-blockquote:text-muted-foreground prose-blockquote:border-l-muted
                  prose-code:text-foreground prose-code:bg-muted prose-code:before:hidden prose-code:after:hidden
                  prose-a:text-primary hover:prose-a:text-primary/80
                  prose-hr:border-border
                  prose-img:rounded-md
                  prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-md prose-pre:p-4 prose-pre:overflow-x-auto
                  prose-table:text-foreground prose-th:border-border prose-td:border-border
                  relative
                  group
                "
							>
								<MarkdownContent
									id={String(index)}
									key={index}
									content={item.content
										.replace(/^```mdx\s*\r?\n/, "")
										.replace(/```$/, "")}
								/>
								<div className="flex gap-2.5 mt-4 items-center justify-start">
									<Tooltip text="Save as file">
										<Button size="icon" variant="ghost" className="h-8 w-8">
											<Download className="!h-3.5 !w-3.5" />
										</Button>
									</Tooltip>
									<Tooltip text="Copy Response">
										<Button size="icon" variant="ghost" className="h-8 w-8">
											<Copy className="!h-3.5 !w-35" />
										</Button>
									</Tooltip>
									<Button size="sm" variant="ghost">
										Export
										<FileText className="!h-3.5 !w-3.5" />
									</Button>
								</div>
							</div>
						);
					}

					return <UserChatBlock key={index} text={item.content as string} />;
				})}
				{isPending && (
					<div className="flex items-center gap-2 animate-pulse">
						<Brain className="!h-3.5 !w-3.5" />
						<p className="text-sm text-foreground/80">
							{thinkingTexts[aiThinkingIndex]}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

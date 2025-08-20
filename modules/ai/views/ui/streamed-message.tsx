"use client";

import { MarkdownContent } from "@/components/ui/markdown-content";
// import { Button } from "@/components/ui/button";
// import { Copy } from "lucide-react";
// import { useStreamText } from "@/hooks/use-stream-text";

export function StreamedMessage({
	index,
	content,
	elements,
}: {
	index: number;
	content: string;
	elements?: React.ReactNode;
}) {
	// const safeContent = content ?? "";
	// const text = useStreamText(
	// 	safeContent.replace(/^```mdx\s*\r?\n/, "").replace(/```$/, ""),
	// 	5,
	// );

	return (
		<div
			key={index}
			className="prose prose-sm max-w-none dark:prose-invert relative group"
		>
			<MarkdownContent
				id={String(index)}
				content={content.replace(/^```mdx\s*\r?\n/, "").replace(/```$/, "")}
			/>
			{elements}
		</div>
	);
}

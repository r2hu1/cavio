"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useAiChatInputState } from "../providers/input-provider";

export default function FolderAiInput() {
	const [value, setValue] = useState<string>("");
	const {
		setValue: stateSetValue,
		setSubmitted,
		pending,
		setMode,
	} = useAiChatInputState();

	const router = useRouter();
	const handleSend = (e: FormEvent) => {
		e.preventDefault();
		if (!value) return;
		stateSetValue(value);
		setMode("chat");
		setSubmitted(true);
		router.push(`/chat`);
		setValue("");
	};

	return (
		<form onSubmit={handleSend} className="relative rounded-xl w-full">
			{/* <BorderTrail /> */}
			<Sparkles className="!h-4 !w-4 absolute left-4 top-1/2 -translate-y-1/2" />
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				id="prompt"
				className="pl-12 pr-14 h-12 rounded-xl"
				placeholder="Describe you next document to AI."
			/>
			<div className="flex absolute right-2 top-1/2 -translate-y-1/2 gap-2 justify-end items-center">
				<Button className="h-8 w-8" type="submit">
					<ArrowUpRight className="!h-4 !w-4" />
				</Button>
			</div>
		</form>
	);
}

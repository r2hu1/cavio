"use client";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip-v2";
import { Copy, PencilLine } from "lucide-react";
import { useAiChatInputState } from "../providers/input-provider";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";

export const UserChatBlock = ({ text }: { text: string }) => {
	const { setValue: stateSetValue } = useAiChatInputState();

	const handleEdit = () => {
		stateSetValue(text);
	};

	return (
		<div className="flex justify-end group relative">
			<div className="grid gap-2">
				<div className="p-3 px-5 bg-sidebar clear-both float-start rounded-xl text-sm sm:text-base max-w-sm sm:max-w-md">
					{text}
				</div>
				<div className="group-hover:opacity-100 transition absolute -bottom-8 right-0 group-hover:visible flex gap-1 justify-end opacity-0 invisible">
					<Tooltip text="Edit Prompt">
						<Button
							size="icon"
							variant="ghost"
							className="hover:!bg-transparent h-8 w-8"
							onClick={handleEdit}
						>
							<PencilLine className="!h-3.5 !w-3.5" />
						</Button>
					</Tooltip>
					<Tooltip text="Copy Prompt">
						<Button
							size="icon"
							variant="ghost"
							className="hover:!bg-transparent h-8 w-8"
						>
							<Copy className="!h-3.5 !w-35" />
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

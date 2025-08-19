"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Bolt,
	ChevronDown,
	Copy,
	Download,
	Loader2,
	Trash,
	X,
} from "lucide-react";
import RenameDocumentInline from "./rename-document-inline";
import { useEditorState } from "@/modules/editor/providers/editor-state-provider";
import Tooltip from "@/components/ui/tooltip-v2";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import DeleteDocumentPopup from "./delete-document-popup";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function DocumentNav({
	id,
	folderId,
}: {
	id: string;
	folderId: string;
}) {
	const { state } = useEditorState();
	const [shareOpen, setShareOpen] = useState(false);

	// const trpc = useTRPC();
	// const { data, isPending, error } = useQuery(
	//   trpc.document.get.queryOptions({ id }),
	// );

	// const handleExport = async(type:"PDF" | "MDX" | "JSON")=>{
	//   if (isPending) return;
	//   const node = data?.content.map((block: any) => JSON.parse(block));

	// }

	return (
		<div className="flex items-center justify-between">
			<RenameDocumentInline
				documentId={id}
				textClassName="text-sm"
				inputClassName="text-sm"
				folderId={folderId}
			/>
			<div className="flex items-center gap-2">
				{state && (
					<Tooltip text="Saving to cloud">
						<Button variant="secondary" className="h-8">
							Syncing <Loader2 className="!h-3.5 animate-spin !w-3.5" />
						</Button>
					</Tooltip>
				)}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							className="h-8 w-8"
							variant="secondary"
							onClick={() => {
								setShareOpen(false);
							}}
						>
							<Bolt className="!h-3.5 !w-3.5" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="sm:mr-26 mt-2">
						<div className="space-y-2.5">
							<RenameDocumentInline
								documentId={id}
								textClassName="text-sm"
								inputClassName="text-sm"
								folderId={folderId}
							/>
							<div className="flex items-center justify-between">
								<Label htmlFor="privacy" className="text-sm text-foreground/80">
									Private
								</Label>
								<Switch id="privacy" defaultChecked />
							</div>
							<div className="flex items-center gap-2 !mt-4">
								<DeleteDocumentPopup folderId={folderId} documentId={id}>
									<Button className="w-full" size="sm" variant="destructive">
										Delete <Trash className="!h-3.5 !w-3.5" />
									</Button>
								</DeleteDocumentPopup>
							</div>
						</div>
					</PopoverContent>
				</Popover>
				<Popover open={shareOpen}>
					<PopoverTrigger asChild>
						<Button
							className="h-8 gap-1"
							onClick={() => {
								setShareOpen(!shareOpen);
							}}
						>
							{shareOpen ? "Close" : "Share"}
							{!shareOpen ? (
								<ChevronDown className="!h-3.5 !w-3.5" />
							) : (
								<X className="!h-3.5 !w-3.5" />
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="mr-5 mt-2">
						<p className="text-sm">Save or share your document with others.</p>
						<div className="mt-4">
							<div>
								<div className="flex items-center gap-2">
									<Input readOnly value="http://localhost:300" />
									<Button variant="outline" size="icon">
										<Copy className="!h-3.5 !w-3.5" />
									</Button>
								</div>
								<div className="flex items-center justify-between mt-3">
									<p className="text-xs text-foreground/90">Visibility</p>
									<div className="flex items-center gap-1.5">
										<Label
											htmlFor="visibility"
											className="text-xs text-foreground/80"
										>
											Private
										</Label>
										<Switch id="visibility" defaultChecked />
									</div>
								</div>
								<div className="flex items-center flex-col mt-6 gap-2.5">
									<Select defaultValue="pdf">
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Export As" />
										</SelectTrigger>
										<SelectContent defaultValue="json">
											<SelectItem value="json">JSON</SelectItem>
											<SelectItem value="mdx">MDX</SelectItem>
											<SelectItem value="pdf">PDF</SelectItem>
										</SelectContent>
									</Select>
									<Button className="w-full">
										Export
										<Download className="!h-3.5 !w-3.5" />
									</Button>
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}

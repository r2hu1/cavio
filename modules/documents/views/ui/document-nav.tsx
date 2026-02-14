"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Tooltip from "@/components/ui/tooltip-v2";
import { useEditorState } from "@/modules/editor/providers/editor-state-provider";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Check,
	ChevronDown,
	Cloud,
	Copy,
	Download,
	Globe,
	Lock,
	X,
} from "lucide-react";
import { useState } from "react";
import RenameDocumentInline from "./rename-document-inline";

export default function DocumentNav({
	id,
	folderId,
}: {
	id: string;
	folderId: string;
}) {
	const { state } = useEditorState();
	const [shareOpen, setShareOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const [exportFormat, setExportFormat] = useState("pdf");
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const { data, isPending } = useQuery(trpc.document.get.queryOptions({ id }));

	const { mutate: toggleShare, isPending: isToggling } = useMutation(
		trpc.document.toggleShare.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: trpc.document.get.queryKey({ id }),
				});
			},
		}),
	);

	const isPublished = data?.isPublished || false;
	const shareUrl = data?.url || "";

	const handleToggleShare = () => {
		toggleShare({ id, isPublished: !isPublished });
	};

	const handleCopyLink = () => {
		if (shareUrl) {
			navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const { mutate: exportDocument, isPending: isExporting } = useMutation(
		trpc.document.export.mutationOptions({
			onSuccess: (data) => {
				const blob = new Blob([data.content], { type: data.mimeType });
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = data.filename;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			},
		}),
	);

	const handleExport = () => {
		exportDocument({ id, format: exportFormat as "json" | "mdx" | "pdf" });
	};

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
						<Cloud className="animate-pulse size-4 text-muted-foreground mr-2" />
					</Tooltip>
				)}
				{/*<Popover>
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
        </Popover>*/}
				<Popover open={shareOpen} onOpenChange={setShareOpen}>
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
					<PopoverContent className="mr-5 mt-2 w-80">
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-sm">Share document</h3>
								<p className="text-sm text-muted-foreground">
									Anyone with the link can view this document.
								</p>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{isPublished ? (
										<Globe className="h-4 w-4" />
									) : (
										<Lock className="h-4 w-4 text-muted-foreground" />
									)}
									<div>
										<p className="text-sm font-medium">
											{isPublished ? "Public" : "Private"}
										</p>
										<p className="text-xs text-muted-foreground">
											{isPublished
												? "Anyone with the link can view"
												: "Only you can access"}
										</p>
									</div>
								</div>
								<Switch
									checked={isPublished}
									onCheckedChange={handleToggleShare}
									disabled={isToggling || isPending}
								/>
							</div>

							{isPublished && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Input
											readOnly
											value={shareUrl || "Generating link..."}
											className="text-xs"
										/>
										<Button
											variant="outline"
											size="icon"
											onClick={handleCopyLink}
											disabled={!shareUrl}
										>
											{copied ? (
												<Check className="!h-3.5 !w-3.5" />
											) : (
												<Copy className="!h-3.5 !w-3.5" />
											)}
										</Button>
									</div>
								</div>
							)}

							<div className="border-t pt-4">
								<p className="text-xs text-muted-foreground mb-3">
									Export document
								</p>
								<div className="flex items-center flex-col gap-2.5">
									<Select value={exportFormat} onValueChange={setExportFormat}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Export As" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="json">JSON</SelectItem>
											<SelectItem value="mdx">MDX</SelectItem>
											<SelectItem value="pdf">PDF</SelectItem>
										</SelectContent>
									</Select>
									<Button
										className="w-full"
										variant="secondary"
										onClick={handleExport}
										disabled={isExporting}
									>
										{isExporting ? "Exporting..." : "Export"}
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

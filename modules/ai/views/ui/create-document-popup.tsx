"use client";

import { Button } from "@/components/ui/button";
import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger,
} from "@/components/ui/credenza";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateDocumentWithAiPopup({
	children,
	triggerClassName,
	content,
	title,
}: {
	children: React.ReactNode;
	triggerClassName?: string;
	content: any;
	title: string;
}) {
	const trpc = useTRPC();
	const { isPending, mutateAsync: formatAsync } = useMutation(
		trpc.ai.formatToMarkdown.mutationOptions(),
	);
	const { mutateAsync: createDocumentAsync, isPending: createDocumentPending } =
		useMutation(trpc.document.create.mutationOptions());

	const { data: folders, isPending: foldersPending } = useQuery(
		trpc.folder.getAll.queryOptions(),
	);
	const [popupOpen, setPopupOpen] = useState(false);
	const router = useRouter();
	const [dtitle, setDtitle] = useState(title);
	const [folderId, setFolderId] = useState("");

	const handleCreateDocument = async () => {
		if (!folderId)
			return toast.error("Please select a folder or create a new one");
		try {
			const formatted = await formatAsync({ content });

			let cleaned = formatted.content
				.replace(/^```json\s*\r?\n/, "")
				.replace(/```$/, "");

			let parsed;
			try {
				parsed = JSON.parse(cleaned);
			} catch (err) {
				console.error("Failed to parse AI JSON:", err);
				toast.error("AI returned invalid JSON format");
				return;
			}

			if (!Array.isArray(parsed)) {
				parsed = [parsed];
			}

			const finalContent = parsed.map((item) =>
				typeof item === "string" ? item : JSON.stringify(item),
			);

			await createDocumentAsync(
				{
					folderId,
					title: dtitle,
					content: finalContent,
				},
				{
					onSuccess: (data) => {
						router.push(`/folder/${folderId}/${data.id}`);
					},
					onError: (error) => {
						toast.error(error.message);
					},
				},
			);
		} catch (error: any) {
			toast.error(error.message || "Something went wrong");
		}
	};

	return (
		<Credenza open={popupOpen} onOpenChange={setPopupOpen}>
			<CredenzaTrigger className={triggerClassName} asChild>
				{children}
			</CredenzaTrigger>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle className="flex items-center gap-2">
						<Sparkles className="!h-3.5 !w-3.5 animate-rainbow" />
						Document with AI
					</CredenzaTitle>
					<CredenzaDescription>
						Let AI create your document.
					</CredenzaDescription>
				</CredenzaHeader>
				<CredenzaBody className="space-y-2">
					<Label htmlFor="document-name">Document Name</Label>
					<Input
						value={dtitle}
						onChange={(e) => setDtitle(e.target.value)}
						id="document-name"
						type="text"
						placeholder="My notes"
						className="!mb-4"
					/>
					<Label>Select Folder</Label>
					<Select value={folderId} onValueChange={(e) => setFolderId(e)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Where the document saved" />
						</SelectTrigger>
						<SelectContent>
							{!foldersPending &&
								folders &&
								folders.map((folder) => (
									<SelectItem key={folder.id} value={folder.id}>
										{folder.title}
									</SelectItem>
								))}
							{!foldersPending && !folders?.length && (
								<SelectItem key="empty" value="empty" disabled>
									No Folders Found.
								</SelectItem>
							)}
						</SelectContent>
					</Select>
				</CredenzaBody>
				<CredenzaFooter>
					<Button
						onClick={handleCreateDocument}
						disabled={isPending || createDocumentPending}
					>
						{isPending
							? "Formatting..."
							: createDocumentPending
								? "Adding to Document..."
								: "Continue"}
					</Button>
				</CredenzaFooter>
			</CredenzaContent>
		</Credenza>
	);
}

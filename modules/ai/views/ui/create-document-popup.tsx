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
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateDocumentWithAiPopup({
	children,
	triggerClassName,
	folderId,
	content,
	title,
}: {
	children: React.ReactNode;
	triggerClassName?: string;
	folderId: string;
	content: any;
	title: string;
}) {
	const trpc = useTRPC();
	const { isPending, mutateAsync: formatAsync } = useMutation(
		trpc.ai.formatToMarkdown.mutationOptions(),
	);
	const { mutateAsync: createDocumentAsync, isPending: createDocumentPending } =
		useMutation(trpc.document.create.mutationOptions());

	const [popupOpen, setPopupOpen] = useState(false);
	const router = useRouter();
	const [dtitle, setDtitle] = useState(title);

	const handleCreateDocument = async () => {
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
			await createDocumentAsync(
				{
					folderId,
					title: dtitle,
					content: parsed,
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
					<CredenzaTitle>New Document</CredenzaTitle>
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
					/>
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

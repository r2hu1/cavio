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
import { Loader } from "@/components/ui/loader";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function RenameFolderPopup({
	folderId,
	children,
	triggerClassName,
	folderName = "",
}: {
	children: React.ReactNode;
	triggerClassName?: string;
	folderId: string;
	folderName?: string;
}) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { mutate } = useMutation(trpc.folder.update.mutationOptions());
	const [loading, setLoading] = useState(false);
	const [popupOpen, setPopupOpen] = useState(false);
	const [currFolderName, setCurrFolderName] = useState(folderName || "");

	const handleRenameFolder = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const name = currFolderName;
		// if (name.length < 5) {
		//   toast.error("Folder name must be at least 5 characters long");
		//   return;
		// }
		setLoading(true);
		mutate(
			{
				title: name,
				id: folderId,
			},
			{
				onSuccess: async () => {
					await queryClient.invalidateQueries(
						trpc.folder.getAll.queryOptions(),
					);
					await queryClient.invalidateQueries(
						trpc.folder.getById.queryOptions({ id: folderId }),
					);
					await queryClient.invalidateQueries(
						trpc.folder.getRecent.queryOptions(),
					);
				},
				onError: (error) => {
					toast.error(error.message);
				},
				onSettled: () => {
					setLoading(false);
					setPopupOpen(false);
				},
			},
		);
	};
	return (
		<Credenza open={popupOpen} onOpenChange={setPopupOpen}>
			<CredenzaTrigger className={triggerClassName} asChild>
				{children}
			</CredenzaTrigger>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Rename</CredenzaTitle>
					<CredenzaDescription>
						Rename your folder to a new name.
					</CredenzaDescription>
				</CredenzaHeader>
				<form className="space-y-4" onSubmit={handleRenameFolder}>
					<CredenzaBody className="space-y-2">
						<Label htmlFor="folder-name">Folder Name</Label>
						<Input
							required
							id="folder-name"
							name="folder-name"
							type="text"
							placeholder="My Blogs"
							value={currFolderName}
							onChange={(e) => setCurrFolderName(e.target.value)}
						/>
					</CredenzaBody>
					<CredenzaFooter>
						<Button disabled={loading} type="submit">
							Continue
							{loading ? <Loader className="size-4" /> : null}
						</Button>
					</CredenzaFooter>
				</form>
			</CredenzaContent>
		</Credenza>
	);
}

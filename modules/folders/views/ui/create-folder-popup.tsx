"use client";
import { Button } from "@/components/ui/button";
import {
	Credenza,
	CredenzaBody,
	CredenzaClose,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateFolderPopup({
	children,
	triggerClassName,
}: {
	children: React.ReactNode;
	triggerClassName?: string;
}) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { mutate } = useMutation(trpc.folder.create.mutationOptions());
	const [loading, setLoading] = useState(false);
	const [popupOpen, setPopupOpen] = useState(false);
	const router = useRouter();

	const handleCreateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const name = formData.get("folder-name") as string;
		if (name.length < 5) {
			toast.error("Folder name must be at least 5 characters long");
			return;
		}
		setLoading(true);
		mutate(
			{
				title: name,
			},
			{
				onSuccess: async (e) => {
					toast.success("Folder created successfully");
					router.push(`/folder/${e.id}`);
					await queryClient.invalidateQueries(
						trpc.folder.getAll.queryOptions(),
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
					<CredenzaTitle>Create Folder</CredenzaTitle>
					<CredenzaDescription>
						Quickly create a new folder in your workspace.
					</CredenzaDescription>
				</CredenzaHeader>
				<form className="space-y-4" onSubmit={handleCreateFolder}>
					<CredenzaBody className="space-y-2">
						<Label htmlFor="folder-name">Folder Name</Label>
						<Input
							id="folder-name"
							required
							name="folder-name"
							type="text"
							placeholder="My Blogs"
						/>
					</CredenzaBody>
					<CredenzaFooter>
						<Button disabled={loading} type="submit">
							{loading ? <Loader2 className="animate-spin" /> : null} Continue
						</Button>
					</CredenzaFooter>
				</form>
			</CredenzaContent>
		</Credenza>
	);
}

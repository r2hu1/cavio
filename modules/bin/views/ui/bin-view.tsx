"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, FolderClockIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { getDaysRemaining } from "../../utils";
import DeletedFolderCard from "./deleted-folder-card";
import DeletedDocumentCard from "./deleted-document-card";

export default function BinView() {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const deletedDocumentsQuery = useQuery(
		trpc.document.getDeleted.queryOptions(),
	);

	const deletedFoldersQuery = useQuery(trpc.folder.getDeleted.queryOptions());

	const restoreDocumentMutation = useMutation(
		trpc.document.restore.mutationOptions({
			onSuccess: (_, variables) => {
				queryClient.setQueryData(
					trpc.document.getDeleted.queryKey(),
					(old: any) =>
						old?.filter((item: any) => item.id !== variables.id) ?? [],
				);
				queryClient.invalidateQueries({
					queryKey: trpc.document.getAll.queryKey(),
				});
			},
		}),
	);

	const restoreFolderMutation = useMutation(
		trpc.folder.restore.mutationOptions({
			onSuccess: (_, variables) => {
				queryClient.setQueryData(
					trpc.folder.getDeleted.queryKey(),
					(old: any) =>
						old?.filter((item: any) => item.id !== variables.id) ?? [],
				);
				queryClient.invalidateQueries({
					queryKey: trpc.folder.getAll.queryKey(),
				});
			},
		}),
	);

	const permanentDeleteDocumentMutation = useMutation(
		trpc.document.permanentDelete.mutationOptions({
			onSuccess: (_, variables) => {
				queryClient.setQueryData(
					trpc.document.getDeleted.queryKey(),
					(old: any) =>
						old?.filter((item: any) => item.id !== variables.id) ?? [],
				);
			},
		}),
	);

	const permanentDeleteFolderMutation = useMutation(
		trpc.folder.permanentDelete.mutationOptions({
			onSuccess: (_, variables) => {
				queryClient.setQueryData(
					trpc.folder.getDeleted.queryKey(),
					(old: any) =>
						old?.filter((item: any) => item.id !== variables.id) ?? [],
				);
			},
		}),
	);

	const deletedDocuments = deletedDocumentsQuery.data;
	const deletedFolders = deletedFoldersQuery.data;

	const isEmpty =
		(!deletedDocuments || deletedDocuments.length === 0) &&
		(!deletedFolders || deletedFolders.length === 0);

	return (
		<div className="space-y-12">
			<div className="space-y-1">
				<h1 className="text-lg md:text-2xl font-medium">Trash Bin</h1>
				<p className="text-muted-foreground">
					Trash will be cleared after every 7 days.
				</p>
			</div>

			{isEmpty && (
				<div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
					<Trash2 className="h-10 w-10 mb-4 opacity-40" />
					<p className="text-sm">Your bin is empty</p>
				</div>
			)}

			{!isEmpty && (
				<>
					{deletedFolders && deletedFolders.length > 0 && (
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<FolderClockIcon className="h-4 w-4" />
								<span>Deleted Folders</span>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{deletedFolders.map((folder: any) => {
									const daysRemaining = getDaysRemaining(folder.deletedAt);

									return (
										<DeletedFolderCard
											isPending={permanentDeleteFolderMutation.isPending}
											folder={folder}
											daysRemaining={daysRemaining}
											onDelete={(id) => {
												permanentDeleteFolderMutation.mutate({
													id: folder.id,
												});
											}}
											onRestore={(id) => {
												restoreFolderMutation.mutate({ id: folder.id });
											}}
										/>
									);
								})}
							</div>
						</div>
					)}

					{deletedDocuments && deletedDocuments.length > 0 && (
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<FileText className="h-4 w-4" />
								<span>Deleted Documents</span>
							</div>

							<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
								{deletedDocuments.map((doc: any) => {
									const daysRemaining = getDaysRemaining(doc.deletedAt);

									return (
										<DeletedDocumentCard
											isPending={permanentDeleteDocumentMutation.isPending}
											daysRemaining={daysRemaining}
											onDelete={(e) =>
												permanentDeleteDocumentMutation.mutate({
													id: doc.id,
												})
											}
											onRestore={(e) =>
												restoreDocumentMutation.mutate({ id: doc.id })
											}
											doc={doc}
										/>
									);
								})}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}

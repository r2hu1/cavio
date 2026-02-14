"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FolderAiInput from "@/modules/ai/views/ui/folder-ai-input";
import CreateDocumentInline from "@/modules/documents/views/ui/create-document-inline";
import DocumentCard from "@/modules/documents/views/ui/document-card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { FilePlus, View } from "lucide-react";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function FolderPageView() {
	const { id } = useParams();

	const trpc = useTRPC();
	const { data, isLoading, error } = useQuery(
		trpc.document.getAllByFolderId.queryOptions({ folderId: id as string }),
	);

	const [viewAsGrid, setViewAsGrid] = useState(false);

	const views = {
		flex: `grid sm:grid-cols-3 md:grid-cols-4 grid-cols-2 gap-3 lg:grid-cols-5`,
		grid: `grid gap-3 sm:grid-cols-2`,
	};

	return (
		<div className="max-w-4xl mx-auto">
			<FolderAiInput />
			<div className="flex items-center justify-between mt-10 !-mb-2">
				<div>
					<h1 className="text-sm text-foreground/80">Documents —</h1>
				</div>
				<Button
					onClick={() => setViewAsGrid(!viewAsGrid)}
					size="sm"
					className="h-6 w-6"
					variant="ghost"
				>
					<View className="!h-3.5 !w-3.5" />
				</Button>
			</div>
			<div className={`mt-8 ${viewAsGrid ? views.grid : views.flex}`}>
				<Suspense>
					{!isLoading &&
						data?.map((document, index) => (
							<DocumentCard
								folderId={id as string}
								id={document.id}
								name={document.title}
								key={index}
								createdAt={document.createdAt}
								updatedAt={document.updatedAt}
							/>
						))}
				</Suspense>
				{isLoading &&
					Array.from({ length: 6 }).map((_, index) => (
						<Skeleton key={index} className="h-20 w-full" />
					))}
			</div>
			{!isLoading && data?.length === 0 && (
				<div className="h-72 mt-24 flex items-center justify-center px-6 sm:px-0">
					<div className="place-content-center grid place-items-center">
						<div className="bg-sidebar rounded-lg h-14 w-full sm:w-[400px] border max-w-xl"></div>
						<div className="bg-secondary rounded-lg h-14 w-[calc(100%+50px)] sm:w-[450px] border z-10 -mt-6 max-w-2xl"></div>
						<div className="bg-sidebar rounded-lg h-14 w-full sm:w-[400px] -mt-6 border max-w-xl"></div>
						<div className="text-center mt-7 space-y-2">
							<h1 className="text-base text-foreground">
								Its so empty here :(
							</h1>
							<p className="text-xs sm:text-sm -mt-1 text-foreground/80">
								Start by creating a new document with AI or manually.
							</p>
							<CreateDocumentInline folderId={id as string}>
								<Button size="sm" className="mt-2">
									New Document
									<FilePlus className="!h-3.5 !w-3.5" />
								</Button>
							</CreateDocumentInline>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

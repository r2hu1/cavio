"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import DocumentCard from "./document-card";

export default function RecentDocuments({
	viewAs = "flex",
}: {
	viewAs: "grid" | "flex";
}) {
	const trpc = useTRPC();
	const { data, isPending, error } = useQuery(
		trpc.document.getRecent.queryOptions(),
	);

	const views = {
		flex: `grid sm:grid-cols-3 md:grid-cols-4 grid-cols-2 lg:grid-cols-5 gap-3`,
		grid: `grid gap-3 sm:grid-cols-2`,
	};
	return (
		<div>
			{isPending && (
				<div>
					<Skeleton className="h-16 w-full" />
				</div>
			)}

			{!isPending && (
				<div className={views[viewAs]}>
					{data?.map((document) => (
						<DocumentCard
							folderId={document.folderId}
							key={document.id}
							id={document.id}
							name={document.title}
							updatedAt={document.updatedAt}
							createdAt={document.createdAt}
						/>
					))}
				</div>
			)}
			{!isPending && (!data || data?.length === 0) && (
				<div className="w-full border border-input rounded-lg border-dashed flex items-center text-center justify-center h-40">
					<div>
						<h1 className="text-sm text-foreground/80">
							Open or create a document to see it here!
						</h1>
					</div>
				</div>
			)}
		</div>
	);
}

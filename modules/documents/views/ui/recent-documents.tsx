"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderPlus } from "lucide-react";
import DocumentCard from "./document-card";
import CreateDocumentInline from "./create-document-inline";

export default function RecentDocuments() {
  const trpc = useTRPC();
  const { data, isPending, error } = useQuery(
    trpc.document.getRecent.queryOptions(),
  );
  return (
    <div>
      {isPending && (
        <div>
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isPending && (
        <div className="sm:grid-cols-3 grid md:flex items-center flex-wrap gap-3">
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

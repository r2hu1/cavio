"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import FolderCard from "./folder-card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderPlus } from "lucide-react";
import CreateFolderInline from "./create-folder-inline";
import { Button } from "@/components/ui/button";

export default function RecentFolders() {
  const trpc = useTRPC();
  const { data, isPending, error } = useQuery(
    trpc.folder.getRecent.queryOptions(),
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
          {data?.map((folder) => (
            <FolderCard
              key={folder.id}
              id={folder.id}
              name={folder.title}
              updatedAt={folder.updatedAt}
              createdAt={folder.createdAt}
              documentCount={folder?.documents?.length}
            />
          ))}
        </div>
      )}
      {!isPending && (!data || data?.length === 0) && (
        <div className="w-full border border-input rounded-lg border-dashed flex items-center text-center justify-center h-40">
          <div>
            <h1 className="text-sm text-foreground/80">
              Open or create a folder to see it here!
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import FolderCard from "./folder-card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderPlus } from "lucide-react";
import CreateFolderInline from "./create-folder-inline";

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
        <div className="w-fit">
          <CreateFolderInline>
            <div className="flex cursor-pointer hover:border-input transition items-center gap-6 border bg-secondary rounded-lg py-2.5 px-3.5">
              <div>
                <h1 className="text-sm">Create Folder</h1>
                <p className="text-[12px] text-foreground/80">Empty folder</p>
              </div>
              <FolderPlus className="text-foreground/80 !h-4 !w-4" />
            </div>
          </CreateFolderInline>
        </div>
      )}
    </div>
  );
}

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
  if (!isPending) {
    console.log(data);
  }
  return (
    <div>
      {isPending && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      )}
      {!isPending && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <CreateFolderInline>
            <div className="bg-sidebar hover:border-input cursor-pointer pb-4 transition hover:shadow-sm rounded-lg border overflow-hidden">
              <div className="bg-sidebar-accent h-12 relative">
                <FolderPlus className="!h-7 !w-7 absolute -bottom-3 left-4 text-sidebar-accent-foreground/50" />
              </div>
              <div className="flex text-sm gap-3 items-center justify-between p-3 pt-5">
                New folder
              </div>
            </div>
          </CreateFolderInline>
        </div>
      )}
    </div>
  );
}

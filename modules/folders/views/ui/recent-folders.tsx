"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import FolderCard from "./folder-card";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="w-full mt-28">
          <div className="w-full grid place-content-center place-items-center">
            <div className="bg-sidebar rounded-lg h-14 w-full sm:w-[400px] border max-w-xl"></div>
            <div className="flex items-center justify-center flex-col bg-secondary rounded-lg h-14 w-[calc(100%+50px)] sm:w-[450px] border z-10 -mt-8 max-w-2xl"></div>
            <div className="bg-sidebar -mt-8 rounded-lg h-14 w-full sm:w-[400px] border max-w-xl"></div>
          </div>
          <div className="mt-5 w-full text-center">
            <h1 className="text-sm sm:text-base text-foreground/80">
              Its so empty here :(
            </h1>
            <p className="text-xs sm:text-sm text-foreground/50">
              Open or edit a folder to see it here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

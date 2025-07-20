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
                Open or create a folder to see it here.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

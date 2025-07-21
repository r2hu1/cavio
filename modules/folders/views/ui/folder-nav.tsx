"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import RenameFolderPopup from "./rename-folder-popup";
import { Bolt, FilePlus, PencilLine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FolderSettingsPopup from "./folder-settings-popup";
import { Button } from "@/components/ui/button";
import CreateDocumentPopup from "@/modules/documents/views/ui/create-document-popup";
import { toast } from "sonner";
import { de } from "zod/v4/locales";

export const FolderNav = ({ folderId }: { folderId: string }) => {
  const trpc = useTRPC();
  const { data, isPending, error } = useQuery(
    trpc.folder.getById.queryOptions({ id: folderId }),
  );
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [isPending]);
  return (
    <div className="flex w-full items-center justify-between">
      <div>
        {!isPending ? (
          <RenameFolderPopup folderId={folderId}>
            <h1 className="text-sm flex items-center gap-2">
              {data?.title}{" "}
              <PencilLine className="cursor-pointer text-foreground/70 !h-3.5 !w-3.5" />
            </h1>
          </RenameFolderPopup>
        ) : (
          <Skeleton className="h-4 w-20" />
        )}
      </div>
      {!isPending ? (
        <div className="items-center gap-2.5 flex">
          <FolderSettingsPopup>
            <Button className="h-8 w-8" variant="secondary">
              <Bolt className="!h-3.5 !w-3.5" />
            </Button>
          </FolderSettingsPopup>
          <CreateDocumentPopup folderId={folderId}>
            <Button className="h-8">
              New Document
              <FilePlus className="!h-3.5 !w-3.5" />
            </Button>
          </CreateDocumentPopup>
        </div>
      ) : (
        <div className="items-center gap-2.5 flex">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-32" />
        </div>
      )}
    </div>
  );
};
export default FolderNav;

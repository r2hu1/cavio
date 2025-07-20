"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CreateDocumentPopup from "@/modules/documents/views/ui/create-document-popup";
import FolderSettingsPopup from "@/modules/folders/views/ui/folder-settings-popup";
import RenameFolderPopup from "@/modules/folders/views/ui/rename-folder-popup";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Bolt, ClockFading, FilePlus, PencilLine } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function DynamicNav() {
  const pathname = usePathname().split("/").filter(Boolean);
  const folderPage = pathname.includes("folder") && pathname.length == 2;
  const documentPage = pathname.includes("folder") && pathname.length == 3;
  const homePage = pathname.length == 0;
  const folderId = pathname[1];
  const documentId = pathname[2];

  return (
    <div className="w-full">
      {homePage && (
        <div className="flex items-center justify-end">
          <Button size="icon" className="h-8 w-8" variant="secondary">
            <ClockFading className="!h-3.5 !w-3.5" />
          </Button>
        </div>
      )}
      {folderPage && <FolderNav folderId={folderId} />}
      {documentPage && (
        <div className="flex items-center justify-end">
          <Button size="icon" className="h-8 w-8" variant="secondary">
            <ClockFading className="!h-3.5 !w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

const FolderNav = ({ folderId }: { folderId: string }) => {
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
    </div>
  );
};

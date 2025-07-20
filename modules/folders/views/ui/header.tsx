"use client";
import { Button } from "@/components/ui/button";
import CreateDocumentPopup from "@/modules/documents/views/ui/create-document-popup";
import { Bolt, FilePlus, PencilLine } from "lucide-react";
import { useParams } from "next/navigation";
import FolderSettingsPopup from "./folder-settings-popup";

export default function Header() {
  const { id } = useParams();

  return (
    <div className="flex items-center justify-between mt-10">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-medium">Folder Name</h1>
        <PencilLine className="!h-4 text-foreground/70 !w-4" />
      </div>
      <div className="flex items-center justify-center gap-2">
        <CreateDocumentPopup folderId={id as string}>
          <Button size="sm" className="text-xs">
            <span className="hidden sm:flex">New File</span>{" "}
            <FilePlus className="!h-3.5 !w-3.5" />
          </Button>
        </CreateDocumentPopup>
        <FolderSettingsPopup>
          <Button size="sm" className="w-8" variant="secondary">
            <Bolt className="!h-3.5 !w-3.5" />
          </Button>
        </FolderSettingsPopup>
      </div>
    </div>
  );
}

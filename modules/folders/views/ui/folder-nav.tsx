"use client";
import { Bolt, FilePlus } from "lucide-react";
import FolderSettingsPopup from "./folder-settings-popup";
import { Button } from "@/components/ui/button";
import RenameFolderInline from "./rename-folder-inline";
import CreateDocumentInline from "@/modules/documents/views/ui/create-document-inline";

export const FolderNav = ({ folderId }: { folderId: string }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <RenameFolderInline
        textClassName="text-sm"
        inputClassName="text-sm"
        folderId={folderId}
      />
      <div className="items-center gap-2.5 flex">
        <FolderSettingsPopup id={folderId}>
          <Button className="h-8 w-8" variant="secondary">
            <Bolt className="!h-3.5 !w-3.5" />
          </Button>
        </FolderSettingsPopup>
        <CreateDocumentInline folderId={folderId}>
          <Button className="h-8 w-8 sm:w-fit">
            <span className="hidden sm:flex">New Document</span>
            <FilePlus className="!h-3.5 !w-3.5" />
          </Button>
        </CreateDocumentInline>
      </div>
    </div>
  );
};
export default FolderNav;

"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import RenameFolderPopup from "./rename-folder-popup";
import { ExternalLink, FilePlus, Link2, PencilLine, Trash } from "lucide-react";
import Link from "next/link";
import CreateDocumentPopup from "@/modules/documents/views/ui/create-document-popup";
import DeleteFolderPopup from "./delete-folder-popup";

export default function FolderSettingsPopup({
  id,
  children,
  triggerClassName,
}: {
  id: string;
  children: React.ReactNode;
  triggerClassName?: string;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <p className="text-xs px-2 py-1.5 text-foreground/70">Folder Actions</p>
        <RenameFolderPopup folderId={id}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <PencilLine className="!h-3.5 !w-3.5" /> Rename
          </DropdownMenuItem>
        </RenameFolderPopup>
        <CreateDocumentPopup folderId={id}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <FilePlus className="!h-3.5 !w-3.5" /> New Document
          </DropdownMenuItem>
        </CreateDocumentPopup>
        <DropdownMenuSeparator />
        <DeleteFolderPopup folderId={id}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <Trash className="!h-3.5 !w-3.5" /> Delete
          </DropdownMenuItem>
        </DeleteFolderPopup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

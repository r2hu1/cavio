"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  ExternalLink,
  FilePlus,
  FolderPlus,
  Link2,
  PencilLine,
  Trash,
} from "lucide-react";
import DeleteFolderPopup from "./delete-folder-popup";
import RenameFolderPopup from "./rename-folder-popup";
import CreateDocumentPopup from "@/modules/documents/views/ui/create-document-popup";
import Link from "next/link";
import CreateFolderPopup from "./create-folder-popup";
export default function FolderActionContextMenu({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <p className="text-xs px-2 py-1.5 text-foreground/70">Folder Actions</p>
        <RenameFolderPopup folderId={id}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            <PencilLine className="!h-3.5 !w-3.5" /> Rename
          </ContextMenuItem>
        </RenameFolderPopup>
        <ContextMenuItem asChild>
          <Link href={`/folder/${id}`}>
            <Link2 className="!h-3.5 !w-3.5" /> Open
          </Link>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Link target="_blank" href={`/folder/${id}`}>
            <ExternalLink className="!h-3.5 !w-3.5" /> Open in new tab
          </Link>
        </ContextMenuItem>
        <CreateDocumentPopup folderId={id}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            <FilePlus className="!h-3.5 !w-3.5" /> New Document
          </ContextMenuItem>
        </CreateDocumentPopup>
        <ContextMenuSeparator />
        <DeleteFolderPopup folderId={id}>
          <ContextMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <Trash className="!h-3.5 !w-3.5" /> Delete
          </ContextMenuItem>
        </DeleteFolderPopup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ExternalLink, FilePlus, Link2, PencilLine, Trash } from "lucide-react";
import Link from "next/link";
import RenameDocumentPopup from "./rename-document-popup";
import DeleteDocumentPopup from "./delete-document-popup";
import CreateDocumentPopup from "./create-document-popup";
export default function DocumentActionContextMenu({
  children,
  id,
  folderId,
}: {
  children: React.ReactNode;
  id: string;
  folderId: string;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <p className="text-xs px-2 py-1.5 text-foreground/70">
          Document Actions
        </p>
        <CreateDocumentPopup folderId={folderId}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            <FilePlus className="!h-3.5 !w-3.5" /> New doc
          </ContextMenuItem>
        </CreateDocumentPopup>
        <RenameDocumentPopup documentId={id} folderId={folderId}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            <PencilLine className="!h-3.5 !w-3.5" /> Rename
          </ContextMenuItem>
        </RenameDocumentPopup>
        <ContextMenuItem asChild>
          <Link href={`/folder/${folderId}/${id}`}>
            <Link2 className="!h-3.5 !w-3.5" /> Open
          </Link>
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Link target="_blank" href={`/folder/${folderId}/${id}`}>
            <ExternalLink className="!h-3.5 !w-3.5" /> Open in new tab
          </Link>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <DeleteDocumentPopup folderId={folderId} documentId={id}>
          <ContextMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <Trash className="!h-3.5 !w-3.5" /> Delete
          </ContextMenuItem>
        </DeleteDocumentPopup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

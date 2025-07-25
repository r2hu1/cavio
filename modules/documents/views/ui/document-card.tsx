import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ClockFading,
  EllipsisVertical,
  ExternalLink,
  FileText,
  Link2,
  PencilLine,
  Settings2,
  Trash,
} from "lucide-react";
import Link from "next/link";
import DeleteDocumentPopup from "./delete-document-popup";
import RenameDocumentPopup from "./rename-document-popup";
import DocumentActionContextMenu from "./action-context-menu";

export default function DocumentCard({
  folderId,
  name,
  id,
  createdAt,
  updatedAt,
}: {
  name: string;
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  folderId: string;
}) {
  return (
    <DocumentActionContextMenu folderId={folderId} id={id}>
      <div className="bg-sidebar transition hover:border-input hover:shadow-sm rounded-lg border overflow-hidden">
        <div className="h-10 bg-sidebar-accent relative">
          <FileText className="w-7 h-7 text-foreground/50 absolute -bottom-2 left-5" />
        </div>
        <div className="flex gap-3 items-center justify-between p-3 pt-4">
          <Link
            href={`/folder/${folderId}/${id}`}
            className="text-sm flex items-center gap-1.5 group"
          >
            {name.split("").length > 18 ? name.slice(0, 18) + "..." : name}
            <ExternalLink className="!h-3.5 !w-3.5 text-foreground/80 hidden group-hover:flex" />
          </Link>
        </div>
        <div className="px-2.5 pb-2 flex items-center justify-between">
          <h3 className="text-[11px] flex items-center gap-1 text-foreground/70">
            <ClockFading className="!w-3 !h-3" />
            {updatedAt ? new Date(updatedAt).toLocaleTimeString() : "Never"}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-4 items-center justify-center flex w-4 cursor-pointer">
                <Settings2 className="!w-3.5 !h-3.5 text-foreground/70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <RenameDocumentPopup
                documentName={name}
                documentId={id}
                folderId={folderId}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <PencilLine className="!w-4 !h-4" />
                  Rename
                </DropdownMenuItem>
              </RenameDocumentPopup>
              <DropdownMenuItem asChild>
                <Link href={`/folder/${folderId}/${id}`}>
                  <Link2 className="!w-4 !h-4" />
                  Open
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link target="_blank" href={`/folder/${folderId}/${id}`}>
                  <ExternalLink className="!w-4 !h-4" />
                  Open in new tab
                </Link>
              </DropdownMenuItem>
              <DeleteDocumentPopup documentId={id} folderId={folderId}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  variant="destructive"
                >
                  <Trash className="!w-4 !h-4" />
                  Delete
                </DropdownMenuItem>
              </DeleteDocumentPopup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </DocumentActionContextMenu>
  );
}

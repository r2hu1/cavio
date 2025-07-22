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
  Trash,
} from "lucide-react";
import Link from "next/link";
import DeleteDocumentPopup from "./delete-document-popup";
import RenameDocumentPopup from "./rename-document-popup";

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
    <div className="bg-sidebar transition hover:shadow-sm rounded-lg border overflow-hidden">
      <div className="h-8 bg-sidebar-accent relative">
        <FileText className="w-6 h-6 text-foreground/50 absolute -bottom-2 left-5" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="absolute right-0">
            <button className="h-8 items-center justify-center flex w-8 cursor-pointer">
              <EllipsisVertical className="!w-3.5 !h-3.5" />
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
      <div className="flex gap-3 items-center justify-between p-3 pt-4">
        <Link
          href={`/folder/${folderId}/${id}`}
          className="text-sm flex items-center gap-1.5 group"
        >
          {name.split("").length > 45 ? name.slice(0, 45) + "..." : name}
          <ExternalLink className="!h-3.5 !w-3.5 text-foreground/80 hidden group-hover:flex" />
        </Link>
      </div>
      <div className="px-2.5 pb-2 flex items-center justify-end sm:justify-between">
        <h3 className="text-xs hidden sm:flex items-center gap-1 text-foreground/70">
          <ClockFading className="!w-3.5 !h-3.5" />
          {updatedAt ? new Date(updatedAt).toLocaleTimeString() : "Never"}
        </h3>
        <h3 className="text-xs items-center gap-1 text-foreground/70">
          {createdAt ? new Date(createdAt).toLocaleTimeString() : ".."}
        </h3>
      </div>
    </div>
  );
}

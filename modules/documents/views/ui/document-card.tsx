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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <EllipsisVertical className="!w-3.5 !h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <PencilLine className="!w-4 !h-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link2 className="!w-4 !h-4" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="!w-4 !h-4" />
              Open in new tab
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash className="!w-4 !h-4" />
              Delete
            </DropdownMenuItem>
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
      <div className="px-2.5 pb-2 flex items-center justify-between">
        <h3 className="text-xs flex items-center gap-1 text-foreground/70">
          <ClockFading className="!w-3.5 !h-3.5" />
          {updatedAt ? new Date(updatedAt).toLocaleTimeString() : "Never"}
        </h3>
        <h3 className="hidden sm:flex text-xs items-center gap-1 text-foreground/70">
          {createdAt ? new Date(createdAt).toLocaleTimeString() : ".."}
        </h3>
      </div>
    </div>
  );
}

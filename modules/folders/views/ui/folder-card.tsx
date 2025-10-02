import { ClockFading, ExternalLink, Folder } from "lucide-react";
import Link from "next/link";
import FolderActionContextMenu from "./action-context-menu";

export default function FolderCard({
  name,
  id,
  createdAt,
  updatedAt,
  documentCount,
}: {
  name: string;
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  documentCount: number | undefined;
}) {
  return (
    <FolderActionContextMenu id={id}>
      <Link href={`/folder/${id}`} className="block w-full max-w-[180px]">
        <div
          className="shadow-none hover:shadow-lg shadow-foreground/5 dark:shadow-none
            flex cursor-pointer hover:border-input transition
            justify-between items-center gap-3 border
            bg-background dark:bg-sidebar rounded-lg py-2.5 px-3.5 w-full max-w-md"
        >
          <div className="flex-1 w-0">
            <h1 className="text-sm truncate">{name}</h1>
            <p className="text-[13px] text-foreground/70">
              {documentCount ?? 0} Documents
            </p>
          </div>
          <Folder className="text-foreground/80 !h-4 !w-4 shrink-0" />
        </div>
      </Link>
    </FolderActionContextMenu>
  );
}

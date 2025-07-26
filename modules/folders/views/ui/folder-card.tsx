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
      <Link href={`/folder/${id}`}>
        <div className="flex md:w-fit cursor-pointer hover:border-input transition justify-between items-center gap-10 border bg-sidebar rounded-lg py-2.5 px-3.5">
          <div>
            <h1 className="text-sm">{name}</h1>
            <p className="text-[13px] text-foreground/80">
              {documentCount ?? 0} Documents
            </p>
          </div>
          <Folder className="text-foreground/80 !h-4 !w-4" />
        </div>
      </Link>
    </FolderActionContextMenu>
  );
}

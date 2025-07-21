import { ClockFading, ExternalLink, Folder } from "lucide-react";
import Link from "next/link";

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
    <div className="bg-sidebar transition hover:shadow-sm rounded-lg border overflow-hidden">
      <div className="bg-sidebar-accent h-12 relative">
        <Folder className="!h-7 !w-7 absolute -bottom-3 left-4 text-sidebar-accent-foreground/50" />
      </div>
      <div className="flex gap-3 items-center justify-between p-3 pt-4">
        <Link
          href={`/folder/${id}`}
          className="text-sm sm:text-base flex items-center justify-between w-full gap-1.5 group"
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
      </div>
    </div>
  );
}

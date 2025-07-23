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
    <div className="bg-sidebar hover:border-input pb-4 transition hover:shadow-sm rounded-lg border overflow-hidden">
      <div className="bg-sidebar-accent h-12 relative">
        <Folder className="!h-7 !w-7 absolute -bottom-3 left-4 text-sidebar-accent-foreground/50" />
      </div>
      <div className="flex gap-3 items-center justify-between p-3 pt-5">
        <Link
          href={`/folder/${id}`}
          className="text-sm flex items-center justify-between w-full gap-1.5 group"
        >
          {name.split("").length > 16 ? name.slice(0, 16) + "..." : name}
        </Link>
      </div>
    </div>
  );
}

import { ClockFading, FileText } from "lucide-react";
import Link from "next/link";
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
      <div className="bg-background dark:shadow-none dark:bg-sidebar cursor-pointer transition hover:border-input hover:shadow-lg shadow-foreground/5 rounded-lg border overflow-hidden">
        <div className="h-8 bg-sidebar/90 dark:bg-sidebar-accent relative">
          <FileText className="w-6 h-6 text-foreground/50 absolute -bottom-2 left-5" />
        </div>
        <div className="flex gap-3 items-center justify-between p-3 pt-4">
          <Link
            href={`/folder/${folderId}/${id}`}
            className="text-sm flex items-center gap-1.5 group"
          >
            {name.split("").length > 18 ? name.slice(0, 18) + "..." : name}
          </Link>
        </div>
        <div className="px-2.5 pb-2 -mt-1 flex items-center justify-between">
          <h3 className="text-[11px] flex items-center gap-1 text-foreground/70">
            <ClockFading className="!w-3 !h-3" />
            {updatedAt ? new Date(updatedAt).toLocaleTimeString() : "Never"}
          </h3>
        </div>
      </div>
    </DocumentActionContextMenu>
  );
}

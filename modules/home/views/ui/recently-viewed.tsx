import RecentFolders from "@/modules/folders/views/ui/recent-folders";
import { FileClock, FolderClockIcon } from "lucide-react";

export default function RecentlyViewed() {
  return (
    <div className="mt-24">
      <h1 className="text-sm flex items-center gap-2 text-foreground/80">
        <FolderClockIcon className="!h-3.5 !w-3.5" /> Recent Folders —
      </h1>
      <div className="mt-7">
        <RecentFolders />
      </div>
    </div>
  );
}

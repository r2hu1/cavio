import RecentFolders from "@/modules/folders/views/ui/recent-folders";
import { Clock } from "lucide-react";

export default function RecentlyViewed() {
  return (
    <div className="mt-24">
      <h1 className="text-sm flex items-center gap-2 text-foreground/80">
        <Clock className="!h-3 !w-3" /> Recently visited.
      </h1>
      <div className="mt-7">
        <RecentFolders />
      </div>
    </div>
  );
}

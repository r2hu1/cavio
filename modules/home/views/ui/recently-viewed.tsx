import { FileClock } from "lucide-react";

export default function RecentlyViewed() {
  return (
    <div className="mt-10">
      <h1 className="text-sm text-foreground/80">Recently Opened</h1>
      <div className="mt-5 grid gap-3">
        <div className="bg-card border p-2 rounded-lg w-fit px-3">
          <FileClock className="w-4 h-4" />
          <p className="text-sm text-foreground/80">Document Name</p>
        </div>
      </div>
    </div>
  );
}

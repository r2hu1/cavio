import { Button } from "@/components/ui/button";
import { ClockFading, FileText } from "lucide-react";

export default function DocumentCard({ name }: { name: string }) {
  return (
    <div className="bg-card h-28 transition hover:shadow-sm rounded-lg border overflow-hidden">
      <div className="h-8 bg-secondary/80 relative">
        <FileText className="w-6 h-6 text-foreground/60 absolute -bottom-2 left-5" />
      </div>
      <div className="flex gap-3 flex-wrap p-3 pt-3">
        <h1 className="text-sm">
          {name.split("").length > 14 ? name.slice(0, 14) + "..." : name}
        </h1>
      </div>
    </div>
  );
}

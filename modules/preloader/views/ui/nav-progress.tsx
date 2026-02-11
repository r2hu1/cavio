"use client";

import { Loader } from "@/components/ai-elements/loader";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useNavigationProgress } from "use-navigation-progress";

export default function NavProgress() {
  const { status } = useNavigationProgress({
    debug: false,
  });
  return (
    <div
      className={cn(
        "py-2 px-3.5 flex cursor-progress items-center transition duration-200 justify-center rounded-t-md fixed bottom-0 left-1/2 -translate-x-1/2 z-[999] bg-primary text-primary-foreground translate-y-0",
        status !== "loading" && "translate-y-full",
      )}
    >
      <div className="flex items-center gap-2">
        <p className="text-sm">Loading</p>
        <Loader className="size-4" />
      </div>
    </div>
  );
}

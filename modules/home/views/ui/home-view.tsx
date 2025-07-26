"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatInput from "@/modules/ai/views/ui/input";
import { useAuthState } from "@/modules/auth/providers/auth-context";
import { ClockFading, CornerDownLeft, Folder, FolderOpen } from "lucide-react";
import RecentlyViewed from "./recently-viewed";
import { useEffect } from "react";
import RecentFolders from "@/modules/folders/views/ui/recent-folders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function HomeView() {
  const getGreetings = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 0 && hours < 12) {
      return "Good morning";
    } else if (hours >= 12 && hours < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };
  const { data: user, error, isPending } = useAuthState();

  return (
    <div>
      <h1 className="text-lg sm:text-xl font-medium">My Workspace</h1>
      <div className="mt-10 space-y-5">
        <h1 className="text-sm text-foreground/80 flex items-center gap-2">
          <FolderOpen className="!h-3.5 !w-3.5" /> Recent Folders
        </h1>
        <RecentFolders />
      </div>
    </div>
  );
}

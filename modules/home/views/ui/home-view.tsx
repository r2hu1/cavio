"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatInput from "@/modules/ai/views/ui/input";
import { useAuthState } from "@/modules/auth/providers/auth-context";
import {
  ClockFading,
  CornerDownLeft,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import RecentlyViewed from "./recently-viewed";
import { useEffect } from "react";
import RecentFolders from "@/modules/folders/views/ui/recent-folders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import RecentDocuments from "@/modules/documents/views/ui/recent-documents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="max-w-4xl mx-auto">
      <div className="space-y-10">
        <h1 className="text-xl flex items-center justify-center gap-2 sm:text-2xl font-bold">
          {getGreetings()},{" "}
          <Avatar>
            <AvatarFallback className="text-sm bg-indigo-700">
              {user?.user?.name?.charAt(0)}
              {user?.user?.name?.slice(-1)}
            </AvatarFallback>
            <AvatarImage src={user?.user?.image} />
          </Avatar>
          <span className="text-foreground/80">{user?.user?.name}</span>
        </h1>
        <ChatInput />
      </div>
      <div className="mt-20 space-y-5">
        <h1 className="text-sm text-foreground/80 flex items-center gap-2">
          <FolderOpen className="!h-3.5 !w-3.5" /> Recent Folders
        </h1>
        <RecentFolders />
      </div>
      <div className="mt-15 space-y-5">
        <h1 className="text-sm text-foreground/80 flex items-center gap-2">
          <FileText className="!h-3.5 !w-3.5" /> Recent Documents
        </h1>
        <RecentDocuments />
      </div>
    </div>
  );
}

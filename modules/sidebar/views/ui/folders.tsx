"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import CreateFolderPopup from "@/modules/folders/views/ui/create-folder-popup";
import {
  ChevronRight,
  ExternalLink,
  FilePlus,
  Folder,
  FolderOpen,
  FolderPlus,
  Plus,
  Trash,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";

interface FolderProps {
  createdAt: Date | null;
  updatedAt: Date | null;
  title: string;
  id: string;
  userId: string;
  documents: string[] | null;
}

export function Folders() {
  const [folders, setFolders] = useState<FolderProps[]>([]);
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.folder.getAll.queryOptions(),
  );
  useEffect(() => {
    if (data) {
      setFolders(data as FolderProps[]);
    }
  }, [data]);

  return (
    <SidebarGroup className="-mt-2 space-y-1">
      <SidebarGroupLabel className="group/folder flex items-center justify-between hover:bg-sidebar-accent">
        Folders
        <CreateFolderPopup triggerClassName="hidden group-hover/folder:block h-4 w-4 rounded">
          <Button variant="ghost" className="hover:bg-accent" size="icon">
            <Plus className="!h-3.5 !w-3.5" />
          </Button>
        </CreateFolderPopup>
      </SidebarGroupLabel>
      <SidebarMenu>
        {isLoading && (
          <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </div>
        )}
        {folders.length > 0 &&
          folders.map((item, index) => (
            <SidebarMenuItem key={index}>
              <ContextMenu key={index}>
                <ContextMenuTrigger>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link href={`/${item.userId}/folders/${item.id}`}>
                      <span>{item.title}</span>
                      <Folder className="!h-3.5 !w-3.5 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:" />
                    </Link>
                  </SidebarMenuButton>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <FilePlus className="!h-4 !w-4" /> Add File
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <ExternalLink className="!h-4 !w-4" /> Open
                  </ContextMenuItem>
                  <ContextMenuItem variant="destructive">
                    <Trash className="!h-4 !w-4" /> Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </SidebarMenuItem>
          ))}
        {!isLoading && !folders.length && (
          <SidebarMenuItem>
            <CreateFolderPopup>
              <SidebarMenuButton className="text-sm">
                <Plus className="!h-3.5 !w-3.5" />
                Add new
              </SidebarMenuButton>
            </CreateFolderPopup>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

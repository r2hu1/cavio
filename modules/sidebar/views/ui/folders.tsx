"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import CreateFolderPopup from "@/modules/folders/views/ui/create-folder-popup";
import {
  EllipsisVertical,
  ExternalLink,
  FilePlus,
  Folder,
  Link2Icon,
  PencilLine,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import RenameFolderPopup from "@/modules/folders/views/ui/rename-folder-popup";
import DeleteFolderPopup from "@/modules/folders/views/ui/delete-folder-popup";
import { usePathname } from "next/navigation";
import CreateDocumentPopup from "@/modules/documents/views/ui/create-document-popup";

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
  const { data, isLoading } = useQuery(trpc.folder.getAll.queryOptions());
  const queryClient = useQueryClient();
  const pathname = usePathname();

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
          <div className="grid gap-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-7 w-full" />
            ))}
          </div>
        )}
        {folders.length > 0 &&
          folders.map((item, index) => (
            <SidebarMenuItem key={index}>
              <ContextMenu key={index}>
                <ContextMenuTrigger>
                  <SidebarMenuButton
                    data-active={pathname === `/folder/${item.id}`}
                    tooltip={item.title}
                    asChild
                  >
                    <Link href={`/folder/${item.id}`}>
                      <span>{item.title}</span>
                      <Folder className="!h-3.5 !w-3.5 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:" />
                    </Link>
                  </SidebarMenuButton>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <RenameFolderPopup folderId={item.id}>
                    <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                      <PencilLine className="!h-4 !w-4" /> Rename
                    </ContextMenuItem>
                  </RenameFolderPopup>
                  <CreateDocumentPopup folderId={item.id}>
                    <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                      <FilePlus className="!h-4 !w-4" /> Add Document
                    </ContextMenuItem>
                  </CreateDocumentPopup>
                  <ContextMenuItem asChild>
                    <Link href={`/folder/${item.id}`}>
                      <Link2Icon className="!h-4 !w-4" /> Open
                    </Link>
                  </ContextMenuItem>
                  <ContextMenuItem asChild>
                    <Link href={`/folder/${item.id}`} target="_blank">
                      <ExternalLink className="!h-4 !w-4" /> Open in New Tab
                    </Link>
                  </ContextMenuItem>
                  <DeleteFolderPopup folderId={item.id}>
                    <ContextMenuItem
                      onSelect={(e) => e.preventDefault()}
                      variant="destructive"
                    >
                      <Trash className="!h-4 !w-4" />
                      Delete
                    </ContextMenuItem>
                  </DeleteFolderPopup>
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

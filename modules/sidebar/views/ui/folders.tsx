"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  ExternalLink,
  FilePlus,
  FileText,
  Folder,
  FolderOpen,
  Link2Icon,
  PencilLine,
  Plus,
  Trash,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";
import RenameFolderPopup from "@/modules/folders/views/ui/rename-folder-popup";
import DeleteFolderPopup from "@/modules/folders/views/ui/delete-folder-popup";
import { usePathname } from "next/navigation";
import CreateFolderInline from "@/modules/folders/views/ui/create-folder-inline";
import CreateDocumentInline from "@/modules/documents/views/ui/create-document-inline";
import CreateDocumentPopup from "@/modules/documents/views/ui/create-document-popup";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import SubFolderMenu from "./sub-folder-menu";

interface FolderProps {
  createdAt: Date | null;
  updatedAt: Date | null;
  title: string;
  id: string;
  userId: string;
  documents: string[] | null;
}
interface DocumentProps {
  createdAt: Date | null;
  updatedAt: Date | null;
  title: string;
  id: string;
  userId: string;
  content: string;
}

export function Folders() {
  const [folders, setFolders] = useState<FolderProps[]>([]);
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.folder.getAll.queryOptions());

  useEffect(() => {
    if (data) {
      setFolders(data as FolderProps[]);
    }
  }, [data]);

  return (
    <SidebarGroup className="-mt-2 space-y-1">
      <SidebarGroupLabel className="group/folder flex items-center justify-between hover:bg-sidebar-accent">
        Folders
        <CreateFolderInline triggerClassName="hidden group-hover/folder:flex">
          <Button
            variant="ghost"
            className="hidden group-hover/folder:flex hover:!bg-input !h-5 !w-5 items-center justify-center"
            size="icon"
          >
            <Plus className="!h-3.5 !w-3.5" />
          </Button>
        </CreateFolderInline>
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
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                <div className="flex w-full items-center hover:bg-sidebar-accent rounded-lg pr-1.5">
                  {/* Left: Folder icon + title */}
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex flex-1 items-center gap-2 cursor-pointer">
                      <ChevronRight className="!h-3.5 !w-3.5 transition-transform duration-200 group-hover/collapsible:flex hidden group-data-[state=open]/collapsible:rotate-90" />
                      <FolderOpen className="!h-3.5 !w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:flex group-hover/collapsible:!hidden hidden" />
                      <Folder className="!h-3.5 !w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:hidden group-hover/collapsible:hidden flex" />
                      <Link
                        href={`/folder/${item.id}`}
                        className="flex items-center gap-2"
                      >
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* Right: Plus Button */}
                  <CreateDocumentInline
                    folderId={item.id}
                    triggerClassName="hidden group-hover/collapsible:flex"
                  >
                    <Button
                      variant="ghost"
                      className="hover:!bg-input !h-5 !w-5 items-center justify-center group-hover/collapsible:flex hidden"
                      size="icon"
                    >
                      <Plus className="text-foreground !h-3.5 !w-3.5" />
                    </Button>
                  </CreateDocumentInline>
                </div>

                <CollapsibleContent className="w-full">
                  <SubFolderMenu folderId={item.id} />
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}

        {!isLoading && !folders.length && (
          <SidebarMenuItem>
            <CreateFolderInline>
              <SidebarMenuButton className="text-sm cursor-pointer">
                <Plus className="!h-3.5 !w-3.5" />
                Add new
              </SidebarMenuButton>
            </CreateFolderInline>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

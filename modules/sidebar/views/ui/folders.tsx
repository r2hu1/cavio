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
import { ChevronRight, FolderOpen, FolderPlus, Plus } from "lucide-react";

export function Folders() {
  const folders: any[] = [];
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        Folders
        <FolderOpen className="!h-3.5 !w-3.5" />
      </SidebarGroupLabel>
      <SidebarMenu className="mt-2 group">
        {folders.length > 0 &&
          folders.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        {!folders.length && (
          <div className="space-y-3 mt-2">
            <div className="h-32 flex items-center justify-center text-foreground/50 text-xs text-center w-full bg-secondary rounded-xl">
              No folders found.
            </div>
            <Button className="w-full" size="sm">
              Add Folder
              <FolderPlus className="h-3 w-3" />
            </Button>
          </div>
        )}
        {folders.length > 0 && (
          <div className="hidden mt-2 group-hover:flex">
            <Button className="w-full" size="sm">
              Add Folder
              <FolderPlus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

"use client";

import { FolderPlus, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthState } from "@/modules/auth/providers/auth-context";
import TextSkeleton from "@/components/text-skeleton";
import Link from "next/link";
import CreateFolderInline from "@/modules/folders/views/ui/create-folder-inline";
import { Loader } from "@/components/ui/loader";

export function NavUser() {
  // const { isMobile } = useSidebar();
  const { data } = useAuthState();
  // const { open } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={data?.user.image} />
            <AvatarFallback className="rounded-lg bg-indigo-700 text-white">
              {data?.user.name ? (
                data.user.name.charAt(0).toUpperCase() +
                data.user.name.split(" ")[1].charAt(0).toUpperCase()
              ) : (
                <Loader className="h-2 w-2  text-white" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <TextSkeleton
              className="truncate font-medium"
              text={data?.user.name}
            />
            <TextSkeleton
              className="truncate text-xs"
              text={data?.user.email}
            />
          </div>
          <CreateFolderInline>
            <FolderPlus className="!h-4 !w-4 cursor-pointer mr-1 text-foreground/80" />
          </CreateFolderInline>
          {/* {open && <SidebarTrigger className="size-6" />} */}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

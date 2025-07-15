import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SearchFolderPopup from "@/modules/folders/views/ui/search-folder-popup";
import { HomeIcon, Search } from "lucide-react";
import Link from "next/link";

export default function DashboardNav() {
  return (
    <SidebarGroup className="mt-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="cursor-pointer"
            tooltip={"Search"}
          >
            <SearchFolderPopup triggerClassName="cursor-pointer flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none">
              <Search className="h-4 !w-4" />{" "}
              <span className="flex items-center justify-between w-full">
                Search{" "}
                <Badge className="text-[10px]" variant="outline">
                  ⌘K
                </Badge>
              </span>
            </SearchFolderPopup>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={"Home"}>
            <Link href="/">
              <HomeIcon className="h-4 !w-4" /> Home
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

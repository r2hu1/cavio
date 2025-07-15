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
          <SearchFolderPopup>
            <SidebarMenuButton className="cursor-pointer" tooltip={"Search"}>
              <Search className="h-4 !w-4" />{" "}
              <span className="flex items-center justify-between w-full">
                Search{" "}
                <Badge className="text-[10px]" variant="outline">
                  ⌘K
                </Badge>
              </span>
            </SidebarMenuButton>
          </SearchFolderPopup>
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

"use client";

import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import DocumentActionContextMenu from "@/modules/documents/views/ui/action-context-menu";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export default function SubFolderMenu({ folderId }: { folderId: string }) {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.document.getAllByFolderId.queryOptions({ folderId }),
  );
  const pathname = usePathname();

  return (
    <SidebarMenuSub>
      {isLoading && (
        <SidebarMenuSubItem className="space-y-1">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-6 rounded-sm w-full" />
          ))}
        </SidebarMenuSubItem>
      )}

      {!isLoading && data && data.length > 0 && (
        <>
          {data.map((document) => (
            <SidebarMenuSubItem key={document.id}>
              <DocumentActionContextMenu id={document.id} folderId={folderId}>
                <SidebarMenuSubButton
                  title={document.title}
                  isActive={pathname === `/folder/${folderId}/${document.id}`}
                  href={`/folder/${folderId}/${document.id}`}
                  className="truncate text-nowrap text-foreground/80"
                >
                  <span className="flex-1 min-w-0 truncate">
                    {document.title}
                  </span>
                </SidebarMenuSubButton>
              </DocumentActionContextMenu>
            </SidebarMenuSubItem>
          ))}
        </>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <SidebarMenuSubItem className="px-2">
          <span className="text-sm text-foreground/50">No docs inside</span>
        </SidebarMenuSubItem>
      )}
    </SidebarMenuSub>
  );
}

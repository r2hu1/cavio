"use client";

import {
  SidebarMenuSubButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import CreateDocumentInline from "@/modules/documents/views/ui/create-document-inline";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { FilePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubFolderMenu({ folderId }: { folderId: string }) {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.document.getAllByFolderId.queryOptions({ folderId }),
  );
  const pathname = usePathname();

  return (
    <SidebarMenuSub className="w-full">
      {isLoading && (
        <SidebarMenuSubItem className="h-8 flex items-center justify-center">
          <Loader2 className="!h-3.5 animate-spin !w-3.5" />
        </SidebarMenuSubItem>
      )}

      {!isLoading && data && data.length > 0 && (
        <>
          {data.map((document) => (
            <SidebarMenuSubItem key={document.id} className="ml-0">
              <SidebarMenuSubButton
                isActive={pathname === `/folder/${folderId}/${document.id}`}
                asChild
              >
                <Link
                  className={cn(
                    "!text-foreground/80 text-sm",
                    pathname === `/folder/${folderId}/${document.id}` &&
                      "text-sidebar-foreground",
                  )}
                  href={`/folder/${folderId}/${document.id}`}
                >
                  {document.title}
                </Link>
              </SidebarMenuSubButton>
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

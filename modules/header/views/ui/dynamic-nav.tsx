"use client";

import { Button } from "@/components/ui/button";
import AccountNav from "@/modules/account/views/ui/account-nav";
import DocumentNav from "@/modules/documents/views/ui/document-nav";
import FolderNav from "@/modules/folders/views/ui/folder-nav";
import { Bolt, ClockFading, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DynamicNav() {
  const pathname = usePathname().split("/").filter(Boolean);
  const folderPage = pathname.includes("folder") && pathname.length == 2;
  const documentPage = pathname.includes("folder") && pathname.length == 3;
  const accountPage = pathname.includes("account") && pathname.length == 1;
  const homePage = pathname.length == 0;
  const folderId = pathname[1];
  const documentId = pathname[2];

  return (
    <div className="w-full">
      {homePage && (
        <div className="flex items-center justify-end">
          <Button size="icon" className="h-8 w-8" variant="secondary">
            <ClockFading className="!h-3.5 !w-3.5" />
          </Button>
        </div>
      )}
      {folderPage && <FolderNav folderId={folderId} />}
      {documentPage && <DocumentNav id={documentId} folderId={folderId} />}
      {accountPage && <AccountNav />}
    </div>
  );
}

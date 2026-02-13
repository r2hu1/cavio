"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import SettingsNav from "@/modules/settings/views/ui/settings-nav";
import HistoryPopup from "@/modules/ai/views/ui/history-popup";
import DocumentNav from "@/modules/documents/views/ui/document-nav";
import FolderNav from "@/modules/folders/views/ui/folder-nav";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  ArchiveRestore,
  Bolt,
  ClockFading,
  Share2,
  Trash,
  Trash2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function DynamicNav() {
  const pathname = usePathname().split("/").filter(Boolean);
  const folderPage = pathname.includes("folder") && pathname.length == 2;
  const documentPage = pathname.includes("folder") && pathname.length == 3;
  const settingsPage = pathname.includes("settings");
  const aiPage = pathname.includes("chat");
  const homePage = pathname.length == 0;
  const folderId = pathname[1];
  const documentId = pathname[2];
  const isBin = pathname.includes("bin");
  const [hasBinItems, setHasBinItems] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isEmptying, setIsEmptying] = useState(false);

  // Check if bin has items and operation states
  useEffect(() => {
    if (isBin) {
      const checkBinState = () => {
        const binOps = (window as any).binOperations;
        setHasBinItems(binOps?.hasItems ?? false);
        setIsRestoring(binOps?.isRestoring ?? false);
        setIsEmptying(binOps?.isEmptying ?? false);
      };

      checkBinState();
      const interval = setInterval(checkBinState, 500);
      return () => clearInterval(interval);
    }
  }, [isBin]);

  const handleRestoreAll = () => {
    const binOps = (window as any).binOperations;
    if (binOps?.restoreAll) {
      binOps.restoreAll();
    }
  };

  const [open, setOpen] = useState(false);

  const handleEmptyTrash = () => {
    const binOps = (window as any).binOperations;
    if (binOps?.emptyTrash) {
      binOps.emptyTrash();
      setOpen(false);
    }
  };

  return (
    <div className="w-full">
      {homePage && (
        <div className="flex items-center justify-end">
          <HistoryPopup>
            <Button size="icon" className="h-8 w-8" variant="secondary">
              <ClockFading className="!h-3.5 !w-3.5" />
            </Button>
          </HistoryPopup>
        </div>
      )}
      {aiPage && (
        <div className="flex items-center justify-end gap-2">
          <HistoryPopup>
            <Button size="icon" className="h-8 w-8" variant="secondary">
              <ClockFading className="!h-3.5 !w-3.5" />
            </Button>
          </HistoryPopup>
          {/*<Button size="sm">
            Share
            <Share2 className="!h-3.5 !w-3.5" />
          </Button>*/}
        </div>
      )}
      {folderPage && <FolderNav folderId={folderId} />}
      {documentPage && <DocumentNav id={documentId} folderId={folderId} />}
      {settingsPage && <SettingsNav path={pathname} />}
      {isBin && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1>Trash Bin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRestoreAll}
              disabled={!hasBinItems || isRestoring}
            >
              <span className="hidden sm:inline">Restore All</span>
              {isRestoring ? <Loader /> : <ArchiveRestore className="size-4" />}
            </Button>
            <Credenza open={open} onOpenChange={setOpen}>
              <CredenzaTrigger asChild>
                <Button size="sm" disabled={!hasBinItems}>
                  Empty Trash <Trash className="size-4" />
                </Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <CredenzaHeader>
                  <CredenzaTitle>Empty Trash?</CredenzaTitle>
                  <CredenzaDescription>
                    This will permanently delete all items in the trash. This
                    action cannot be undone.
                  </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaFooter>
                  <CredenzaClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </CredenzaClose>
                  <Button
                    variant="destructive"
                    onClick={handleEmptyTrash}
                    disabled={isEmptying}
                  >
                    Continue {isEmptying && <Loader />}
                  </Button>
                </CredenzaFooter>
              </CredenzaContent>
            </Credenza>
          </div>
        </div>
      )}
    </div>
  );
}

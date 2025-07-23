"use client";

import { Button } from "@/components/ui/button";
import { Bolt, Share2 } from "lucide-react";
import RenameDocumentInline from "./rename-document-inline";

export default function DocumentNav({
  id,
  folderId,
}: {
  id: string;
  folderId: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <RenameDocumentInline
        documentId={id}
        textClassName="text-sm"
        inputClassName="text-sm"
        folderId={folderId}
      />
      <div className="flex items-center gap-2">
        <Button className="h-8 w-8" variant="secondary">
          <Bolt className="!h-3.5 !w-3.5" />
        </Button>
        <Button className="h-8">
          Share
          <Share2 className="!h-3.5 !w-3.5" />
        </Button>
      </div>
    </div>
  );
}

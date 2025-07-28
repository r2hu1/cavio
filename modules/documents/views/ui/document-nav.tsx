"use client";

import { Button } from "@/components/ui/button";
import { Bolt, Loader2, Save, Share2 } from "lucide-react";
import RenameDocumentInline from "./rename-document-inline";
import { useEditorState } from "@/modules/editor/providers/editor-state-provider";
import Tooltip from "@/components/ui/tooltip-v2";

export default function DocumentNav({
  id,
  folderId,
}: {
  id: string;
  folderId: string;
}) {
  const { state } = useEditorState();

  return (
    <div className="flex items-center justify-between">
      <RenameDocumentInline
        documentId={id}
        textClassName="text-sm"
        inputClassName="text-sm"
        folderId={folderId}
      />
      <div className="flex items-center gap-2">
        {state ? (
          <Button variant="secondary" className="h-8">
            Syncing <Loader2 className="!h-3.5 animate-spin !w-3.5" />
          </Button>
        ) : (
          <Tooltip text="Saved to cloud">
            <Button variant="secondary" className="h-8">
              Synced <Save className="!h-3.5 !w-3.5" />
            </Button>
          </Tooltip>
        )}
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

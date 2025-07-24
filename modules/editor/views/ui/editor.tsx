"use client";

import * as React from "react";

import { Plate, usePlateEditor } from "platejs/react";

import { EditorKit } from "@/components/editor/editor-kit";
import { CopilotKit } from "@/components/editor/plugins/copilot-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";

export default function CopilotDemo() {
  const editor = usePlateEditor({
    plugins: [...CopilotKit, ...EditorKit],
  });

  return (
    <Plate editor={editor}>
      <EditorContainer variant="default">
        <Editor variant="ai" placeholder="New Document ( / for commands)" />
      </EditorContainer>
    </Plate>
  );
}

"use client";

import * as React from "react";

import { Plate, usePlateEditor } from "platejs/react";

import { EditorKit } from "@/components/editor/editor-kit";
import { CopilotKit } from "@/components/editor/plugins/copilot-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";

const initialValue = [
  { type: "h1", children: [{ text: "New Document" }] },
  {
    type: "p",
    children: [{ text: "Type '/' at start of line to see tools." }],
  },
  {
    type: "p",
    children: [
      { text: "Press space with an empty string on the start to trigger AI." },
    ],
  },
  {
    type: "p",
    children: [
      { text: "Click here or on the 'New Document' and start writing." },
    ],
  },
];

export default function CopilotDemo() {
  const editor = usePlateEditor({
    plugins: [...CopilotKit, ...EditorKit],
    value: initialValue,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer variant="default">
        <Editor variant="ai" placeholder="New Document" />
      </EditorContainer>
    </Plate>
  );
}

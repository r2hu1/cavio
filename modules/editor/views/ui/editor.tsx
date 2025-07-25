"use client";

import * as React from "react";

import { Plate, usePlateEditor } from "platejs/react";

import { EditorKit } from "@/components/editor/editor-kit";
import { CopilotKit } from "@/components/editor/plugins/copilot-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";

export const initialValue = [
  {
    type: "h1",
    children: [{ text: "Untitled Document" }],
  },
  {
    type: "p",
    children: [{ text: "" }],
  },
  {
    type: "blockquote",
    children: [
      {
        text: "Type “/” to open the command menu.",
      },
    ],
  },
  {
    type: "blockquote",
    children: [
      {
        text: "Press space on an empty line to ask AI for help.",
      },
    ],
  },
  {
    type: "p",
    children: [
      {
        text: "Welcome! This is your space to write, brainstorm, or plan.",
      },
    ],
  },
  {
    type: "h2",
    children: [{ text: "Getting Started" }],
  },
  {
    type: "ul",
    children: [
      {
        type: "li",
        children: [
          {
            text: "Use the slash (/) command to insert blocks like headings, lists, or images.",
          },
        ],
      },
      {
        type: "li",
        children: [
          {
            text: 'Hit "space" on a new line to trigger the AI assistant.',
          },
        ],
      },
      {
        type: "li",
        children: [
          {
            text: "Select text to access formatting options.",
          },
        ],
      },
    ],
  },
  {
    type: "p",
    children: [{ text: "" }],
  },
  {
    type: "callout",
    children: [
      {
        text: "Try starting with a brain dump or outline — don’t worry about perfection!",
      },
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

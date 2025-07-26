"use client";

import { Plate, usePlateEditor } from "platejs/react";

import { EditorKit } from "@/components/editor/editor-kit";
import { CopilotKit } from "@/components/editor/plugins/copilot-kit";
import { Editor as EditorPlate, EditorContainer } from "@/components/ui/editor";
import { useDebounce } from "@/hooks/use-debounce";
import { Value } from "platejs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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

export default function Editor({ id }: { id: string }) {
  const [value, setValue] = useState<any>([]);
  const debouncedValue = useDebounce(value, 2000);
  const [loading, setLoading] = useState(false);
  const trpc = useTRPC();
  const { mutate, error } = useMutation(trpc.document.update.mutationOptions());

  const { data, isPending } = useQuery(trpc.document.get.queryOptions({ id }));

  const editor = usePlateEditor({
    plugins: [...CopilotKit, ...EditorKit],
    value: value || initialValue,
  });

  const handleValueChange = useCallback((e: any) => {
    setValue(e.value);
  }, []);

  useEffect(() => {
    if (!debouncedValue) return;
    if (!data) return;
    setLoading(true);
    mutate(
      {
        content: debouncedValue,
        id: data.id,
      },
      {
        onSuccess: () => {
          setLoading(false);
        },
        onError: (e) => {
          toast.error("Failed to update document");
          console.error(e);
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
  }, [debouncedValue]);

  useEffect(() => {
    if (data?.content) {
      try {
        const parsed = Array.isArray(data.content)
          ? data.content.map((c) => JSON.parse(c))
          : initialValue;

        setValue(parsed);
      } catch (err) {
        console.error("Error parsing content from DB:", err);
        setValue(initialValue);
      }
    }
  }, [data]);

  return (
    <Plate editor={editor} onValueChange={handleValueChange}>
      <EditorContainer variant="default">
        <EditorPlate variant="ai" placeholder="New Document" />
      </EditorContainer>
    </Plate>
  );
}

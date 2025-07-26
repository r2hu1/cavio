"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Plate, usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import { CopilotKit } from "@/components/editor/plugins/copilot-kit";
import { Editor as EditorPlate, EditorContainer } from "@/components/ui/editor";
import { useDebounce } from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditorProps {
  id: string;
}

export default function Editor({ id }: EditorProps) {
  const defaultValue = [
    {
      type: "p",
      children: [{ text: "" }],
    },
  ];

  const [value, setValue] = useState<any>(defaultValue);
  const debouncedValue = useDebounce(value, 2000);
  const hasLoadedFromDB = useRef(false);
  const trpc = useTRPC();

  const { data, isPending } = useQuery(trpc.document.get.queryOptions({ id }));
  const { mutate } = useMutation(trpc.document.update.mutationOptions());
  const [loading, setLoading] = useState(false);

  // Initialize editor with proper configuration
  const editor = usePlateEditor({
    plugins: [...CopilotKit, ...EditorKit],
    value: defaultValue,
    autoSelect: "end",
  });

  // Load data from database
  useEffect(() => {
    if (data?.content && !hasLoadedFromDB.current) {
      try {
        let parsed: any = [];
        if (typeof data.content === "string") {
          parsed = JSON.parse(data.content);
          // Check if it's an array of strings instead of array of objects
          if (Array.isArray(parsed) && typeof parsed[0] === "string") {
            parsed = parsed.map((item: string) => JSON.parse(item));
          }
        } else {
          parsed = data.content;
        }

        // Ensure we have valid editor content
        if (Array.isArray(parsed) && parsed.length > 0) {
          setValue(parsed);
        } else {
          setValue([
            {
              type: "p",
              children: [{ text: "" }],
            },
          ]);
        }
        hasLoadedFromDB.current = true;
      } catch (err) {
        console.error("Error parsing document content:", err);
        setValue([
          {
            type: "p",
            children: [{ text: "" }],
          },
        ]);
        hasLoadedFromDB.current = true;
      }
    }
  }, [data?.content, isPending]);

  // Auto-save functionality
  useEffect(() => {
    if (
      !hasLoadedFromDB.current ||
      !debouncedValue ||
      !data?.id ||
      !Array.isArray(debouncedValue)
    )
      return;

    try {
      let original;
      if (typeof data.content === "string") {
        original = JSON.parse(data.content);
      } else {
        original = data.content;
      }

      // Compare current value with original - use a safer comparison
      const currentValueString = JSON.stringify(debouncedValue);
      const originalString = JSON.stringify(original);

      if (currentValueString === originalString) {
        return;
      }

      setLoading(true);
      mutate(
        { id: data.id, content: debouncedValue },
        {
          onSuccess: () => {
            setLoading(false);
            toast.success("Document saved successfully");
          },
          onError: (err) => {
            setLoading(false);
            toast.error("Failed to save document");
            console.error("Save error:", err);
          },
        },
      );
    } catch (err) {
      console.error("Error comparing or updating document:", err);
      setLoading(false);
    }
  }, [debouncedValue, data?.id, data?.content, mutate]);

  const handleValueChange = useCallback((event: any) => {
    // Extract just the value from the event object to avoid circular references
    const newValue = event?.value || event;
    if (Array.isArray(newValue)) {
      setValue(newValue);
    }
  }, []);

  if (isPending) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-2 right-2 text-sm text-gray-500">
          Saving...
        </div>
      )}
      <Plate editor={editor} onValueChange={handleValueChange}>
        <EditorContainer variant="default">
          <EditorPlate
            variant="ai"
            placeholder="Click here to start writing."
          />
        </EditorContainer>
      </Plate>
    </div>
  );
}

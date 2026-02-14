"use client";
import { BaseEditorKit } from "@/components/editor/editor-base-kit";
import { CopilotKit } from "@/components/editor/plugins/copilot-kit";
import { EditorContainer, Editor as EditorPlate } from "@/components/ui/editor";
import { useDebounce } from "@/hooks/use-debounce";
import AiPopup from "@/modules/ai/views/ui/ai-popup";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { useTRPC } from "@/trpc/client";
import { MarkdownPlugin } from "@platejs/markdown";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plate, useEffectOnce, usePlateEditor } from "platejs/react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useEditorState } from "../../providers/editor-state-provider";

export default function Editor({ id }: { id: string }) {
  const [defaultValue, setDefaultValue] = useState<any>([]);

  const [value, setValue] = useState<any>(defaultValue);
  const debouncedValue = useDebounce(value, 5000);
  const trpc = useTRPC();

  const { data, isPending } = useQuery(trpc.document.get.queryOptions({ id }));
  const { mutate } = useMutation(trpc.document.update.mutationOptions());
  const { setState } = useEditorState();

  const handleValueChange = useCallback((event: any) => {
    const markdownValue = editor.api.markdown.serialize();
    if (markdownValue) {
      setValue(markdownValue);
    }
  }, []);

  const editor = usePlateEditor({
    plugins: [...CopilotKit, ...BaseEditorKit],
    autoSelect: "end",
    //@ts-ignore
    id: "main",
    //@ts-ignore
    shouldInitialize: false,
  });

  useEffectOnce(() => {
    if (!isPending && data?.content) {
      setDefaultValue(data.content);
      editor.tf.init({
        value: (editor: any) =>
          editor.getApi(MarkdownPlugin).markdown.deserialize(data.content),
        autoSelect: "end",
      });
    }
  }, [isPending, data]);

  const handleSave = useCallback(() => {
    if (!debouncedValue || debouncedValue === defaultValue) return false;

    setState(true);

    mutate(
      { id, content: debouncedValue },
      {
        onSettled: () => {
          setDefaultValue(debouncedValue);
          setState(false);
        },
      },
    );

    return true;
  }, [debouncedValue, defaultValue, id, mutate, setState]);

  // Save immediately with current editor content (for Ctrl+S)
  const handleImmediateSave = useCallback(() => {
    const currentContent = editor?.api?.markdown?.serialize();
    if (!currentContent || currentContent === defaultValue) return false;

    setState(true);

    mutate(
      { id, content: currentContent },
      {
        onSettled: () => {
          setDefaultValue(currentContent);
          setValue(currentContent);
          setState(false);
        },
      },
    );

    return true;
  }, [editor, defaultValue, id, mutate, setState]);

  useEffect(() => {
    handleSave();
  }, [debouncedValue, handleSave]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleImmediateSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleImmediateSave]);

  if (isPending) {
    return <PageLoader />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <Plate editor={editor} onValueChange={handleValueChange}>
        <EditorContainer variant="default" className="-mt-10">
          <EditorPlate
            spellCheck={false}
            defaultValue={defaultValue}
            variant="ai"
            placeholder="Click here to start writing."
          />
        </EditorContainer>
        <AiPopup
          insert={""}
          lastEdited={value.slice(-300)}
          title={data?.title}
        />
      </Plate>
    </Suspense>
  );
}

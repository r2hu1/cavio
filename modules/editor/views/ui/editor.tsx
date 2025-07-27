"use client";
import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { Plate, useEffectOnce, usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import { CopilotKit } from "@/components/editor/plugins/copilot-kit";
import { Editor as EditorPlate, EditorContainer } from "@/components/ui/editor";
import { useDebounce } from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import PageLoader from "@/modules/preloader/views/ui/page-loader";

export default function Editor({ id }: { id: string }) {
  const [defaultValue, setDefaultValue] = useState<any>([]);

  const [value, setValue] = useState<any>(defaultValue);
  const debouncedValue = useDebounce(value, 2000);
  const trpc = useTRPC();

  const { data, isPending } = useQuery(trpc.document.get.queryOptions({ id }));
  const { mutate } = useMutation(trpc.document.update.mutationOptions());
  const [loading, setLoading] = useState(false);

  const handleValueChange = useCallback((event: any) => {
    const newValue = event?.value || event;
    if (Array.isArray(newValue)) {
      setValue(newValue);
    }
  }, []);

  const editor = usePlateEditor({
    plugins: [...CopilotKit, ...EditorKit],
    autoSelect: "end",
    //@ts-ignore
    shouldInitialize: false,
  });

  useEffectOnce(() => {
    if (!isPending) {
      //@ts-ignore
      setDefaultValue(data.content.map((block: any) => JSON.parse(block)));
      editor.tf.init({
        //@ts-ignore
        value: data.content.map((block: any) => JSON.parse(block)),
        autoSelect: "end",
        onReady: ({ editor, value }) => {
          console.info("Editor ready with value:", value);
        },
      });
    }
  }, [isPending, data]);

  useEffect(() => {
    if (defaultValue != debouncedValue && defaultValue !== value) {
      setLoading(true);
      mutate({ id, content: debouncedValue });
      setLoading(false);
    }
  }, [debouncedValue]);

  if (isPending) {
    return <PageLoader />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <Plate editor={editor} onValueChange={handleValueChange}>
        <EditorContainer variant="default">
          <EditorPlate
            defaultValue={defaultValue}
            variant="ai"
            placeholder="Click here to start writing."
          />
        </EditorContainer>
      </Plate>
    </Suspense>
  );
}

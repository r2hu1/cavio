"use client";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { useEditorState } from "../../providers/editor-state-provider";
import AiPopup from "@/modules/ai/views/ui/ai-popup";

export default function Editor({ id }: { id: string }) {
  const [defaultValue, setDefaultValue] = useState<any>([]);

  const [value, setValue] = useState<any>(defaultValue);
  const debouncedValue = useDebounce(value, 2000);
  const trpc = useTRPC();

  // const { data, isPending } = useQuery(trpc.document.get.queryOptions({ id }));
  // const { mutate } = useMutation(trpc.document.update.mutationOptions());
  const { setState } = useEditorState();

  // const handleValueChange = useCallback((event: any) => {
  //   const markdownValue = editor.api.markdown.serialize();
  //   if (markdownValue) {
  //     setValue(markdownValue);
  //   }
  // }, []);

  // const editor = usePlateEditor({
  //   plugins: [...CopilotKit, ...EditorKit],
  //   autoSelect: "end",
  //   //@ts-ignore
  //   id: "main",
  //   //@ts-ignore
  //   shouldInitialize: false,
  // });

  // useEffectOnce(() => {
  //   if (!isPending && data?.content) {
  //     setDefaultValue(data.content);
  //     editor.tf.init({
  //       value: (editor: any) =>
  //         editor.getApi(MarkdownPlugin).markdown.deserialize(data.content),
  //       autoSelect: "end",
  //     });
  //   }
  // }, [isPending, data]);

  // useEffect(() => {
  //   if (defaultValue != debouncedValue && defaultValue !== value) {
  //     setState(true);
  //     mutate(
  //       { id, content: debouncedValue },
  //       {
  //         onSettled: () => {
  //           setState(false);
  //         },
  //       },
  //     );
  //   }
  // }, [debouncedValue]);

  // if (isPending) {
  //   return <PageLoader />;
  // }
  return (
    <Suspense fallback={<PageLoader />}>
      <div>
        <h1>Editor</h1>
      </div>
    </Suspense>
  );
}

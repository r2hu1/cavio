"use client";
import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { Plate, useEffectOnce, usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import { CopilotKit } from "@/components/editor/plugins/copilot-kit";
import { Editor as EditorPlate, EditorContainer } from "@/components/ui/editor";
import { useDebounce } from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { useEditorState } from "../../providers/editor-state-provider";
import { MarkdownPlugin } from "@platejs/markdown";
import AiPopup from "@/modules/ai/views/ui/ai-popup";

export default function Editor({ id }: { id: string }) {
	const [defaultValue, setDefaultValue] = useState<any>([]);

	const [value, setValue] = useState<any>(defaultValue);
	const debouncedValue = useDebounce(value, 2000);
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
		plugins: [...CopilotKit, ...EditorKit],
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

	useEffect(() => {
		if (defaultValue != debouncedValue && defaultValue !== value) {
			setState(true);
			mutate(
				{ id, content: debouncedValue },
				{
					onSettled: () => {
						setState(false);
					},
				},
			);
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

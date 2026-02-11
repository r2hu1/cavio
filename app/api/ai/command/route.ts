import type { ChatMessage, ToolName } from "@/components/editor/use-chat";
import type { NextRequest } from "next/server";

import { createGateway } from "@ai-sdk/gateway";
import {
  type LanguageModel,
  type UIMessageStreamWriter,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  Output,
  streamText,
  tool,
} from "ai";
import { NextResponse } from "next/server";
import { type SlateEditor, createSlateEditor, nanoid } from "platejs";
import { z } from "zod";

import { markdownJoinerTransform } from "@/lib/markdown-joiner-transform";

import {
  buildEditTableMultiCellPrompt,
  getChooseToolPrompt,
  getCommentPrompt,
  getEditPrompt,
  getGeneratePrompt,
} from "./prompt";
import { getApiKey, getCommandModel } from "@/modules/ai/views/creds/lib";
import { BaseEditorKit } from "@/components/editor/editor-base-kit";
import { googleai } from "@/lib/google-ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  const { apiKey: key, ctx, messages: messagesRaw, model: modelParam } = await req.json();

  const { children, selection, toolName: toolNameParam } = ctx;

  const editor = createSlateEditor({
    // plugins: BaseEditorKit,
    selection,
    value: children,
  });

  const apiKey = await getApiKey();
  const selectedModel = await getCommandModel();

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing AI Gateway API key." },
      { status: 401 },
    );
  }

  const isSelecting = editor.api.isExpanded();

  const gatewayProvider = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  const modelName = modelParam || selectedModel;

  try {
    const stream = createUIMessageStream<ChatMessage>({
      execute: async ({ writer }) => {
        let toolName = toolNameParam;

        if (!toolName) {
          const prompt = getChooseToolPrompt({
            isSelecting,
            messages: messagesRaw,
          });

          const enumOptions = isSelecting
            ? ["generate", "edit", "comment"]
            : ["generate", "comment"];

          const { output: AIToolName } = await generateText({
            model: gatewayProvider.languageModel(modelName),
            output: Output.choice({ options: enumOptions }),
            prompt,
          });

          writer.write({
            data: AIToolName as ToolName,
            type: "data-toolName",
          });

          toolName = AIToolName;
        }

        const stream = streamText({
          experimental_transform: markdownJoinerTransform(),
          model: gatewayProvider.languageModel(modelName),
          // Not used
          prompt: "",
          tools: {
            comment: getCommentTool(editor, {
              messagesRaw,
              model: gatewayProvider.languageModel(modelName),
              writer,
            }),
            table: getTableTool(editor, {
              messagesRaw,
              model: gatewayProvider.languageModel(modelName),
              writer,
            }),
          },
          prepareStep: async (step) => {
            if (toolName === "comment") {
              return {
                ...step,
                toolChoice: { toolName: "comment", type: "tool" },
              };
            }

            if (toolName === "edit") {
              const [editPrompt, editType] = getEditPrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });

              // Table editing uses the table tool
              if (editType === "table") {
                return {
                  ...step,
                  toolChoice: { toolName: "table", type: "tool" },
                };
              }

              return {
                ...step,
                activeTools: [],
                model: gatewayProvider.languageModel(modelName),
                messages: [
                  {
                    content: editPrompt,
                    role: "user",
                  },
                ],
              };
            }

            if (toolName === "generate") {
              const generatePrompt = getGeneratePrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });

              return {
                ...step,
                activeTools: [],
                messages: [
                  {
                    content: generatePrompt,
                    role: "user",
                  },
                ],
                model: gatewayProvider.languageModel(modelName),
              };
            }
          },
        });

        writer.merge(stream.toUIMessageStream({ sendFinish: false }));
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch {
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}

const getCommentTool = (
  editor: SlateEditor,
  {
    messagesRaw,
    model,
    writer,
  }: {
    messagesRaw: ChatMessage[];
    model: LanguageModel;
    writer: UIMessageStreamWriter<ChatMessage>;
  },
) =>
  tool({
    description: "Comment on the content",
    inputSchema: z.object({}),
    strict: true,
    execute: async () => {
      const commentSchema = z.object({
        blockId: z
          .string()
          .describe(
            "The id of the starting block. If the comment spans multiple blocks, use the id of the first block.",
          ),
        comment: z
          .string()
          .describe("A brief comment or explanation for this fragment."),
        content: z
          .string()
          .describe(
            String.raw`The original document fragment to be commented on.It can be the entire block, a small part within a block, or span multiple blocks. If spanning multiple blocks, separate them with two \n\n.`,
          ),
      });

      const { partialOutputStream } = streamText({
        model,
        output: Output.array({ element: commentSchema }),
        prompt: getCommentPrompt(editor, {
          messages: messagesRaw,
        }),
      });

      let lastLength = 0;

      for await (const partialArray of partialOutputStream) {
        for (let i = lastLength; i < partialArray.length; i++) {
          const comment = partialArray[i];
          const commentDataId = nanoid();

          writer.write({
            id: commentDataId,
            data: {
              comment,
              status: "streaming",
            },
            type: "data-comment",
          });
        }

        lastLength = partialArray.length;
      }

      writer.write({
        id: nanoid(),
        data: {
          comment: null,
          status: "finished",
        },
        type: "data-comment",
      });
    },
  });

const getTableTool = (
  editor: SlateEditor,
  {
    messagesRaw,
    model,
    writer,
  }: {
    messagesRaw: ChatMessage[];
    model: LanguageModel;
    writer: UIMessageStreamWriter<ChatMessage>;
  },
) =>
  tool({
    description: "Edit table cells",
    inputSchema: z.object({}),
    strict: true,
    execute: async () => {
      const cellUpdateSchema = z.object({
        content: z
          .string()
          .describe(
            String.raw`The new content for the cell. Can contain multiple paragraphs separated by \n\n.`,
          ),
        id: z.string().describe("The id of the table cell to update."),
      });

      const { partialOutputStream } = streamText({
        model,
        output: Output.array({ element: cellUpdateSchema }),
        prompt: buildEditTableMultiCellPrompt(editor, messagesRaw),
      });

      let lastLength = 0;

      for await (const partialArray of partialOutputStream) {
        for (let i = lastLength; i < partialArray.length; i++) {
          const cellUpdate = partialArray[i];

          writer.write({
            id: nanoid(),
            data: {
              cellUpdate,
              status: "streaming",
            },
            type: "data-table",
          });
        }

        lastLength = partialArray.length;
      }

      writer.write({
        id: nanoid(),
        data: {
          cellUpdate: null,
          status: "finished",
        },
        type: "data-table",
      });
    },
  });

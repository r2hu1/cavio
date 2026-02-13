import type { ChatMessage, ToolName } from "@/components/editor/use-chat";
import type { NextRequest } from "next/server";

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
import { getApiKey, getCommandModel, getProvider } from "@/modules/ai/views/creds/lib";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { AIProvider } from "@/modules/ai/types";

function createProvider(provider: AIProvider, apiKey: string) {
  switch (provider) {
    case "gemini":
      return createGoogleGenerativeAI({ apiKey });
    case "openrouter":
      return createOpenRouter({ apiKey });
    case "groq":
      return createOpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
      });
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function getModelId(provider: AIProvider, model: string) {
  switch (provider) {
    case "gemini":
      return `models/${model}`;
    case "openrouter":
    case "groq":
      return model;
    default:
      return model;
  }
}

export async function POST(req: NextRequest) {
  const {
    apiKey: key,
    ctx,
    messages: messagesRaw,
    model: modelParam,
  } = await req.json();

  const { children, selection, toolName: toolNameParam } = ctx;

  const editor = createSlateEditor({
    selection,
    value: children,
  });

  const provider = await getProvider();
  const apiKey = await getApiKey(provider);
  const selectedModel = await getCommandModel();

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "No API key found, please set it in the [settings](/settings/preferences).",
      },
      { status: 401 },
    );
  }

  const isSelecting = editor.api.isExpanded();

  const aiProvider = createProvider(provider, apiKey);
  const modelName = modelParam || selectedModel;
  const modelId = getModelId(provider, modelName);

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
            model: aiProvider.languageModel(modelId),
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
          model: aiProvider.languageModel(modelId),
          // Not used
          prompt: "",
          tools: {
            comment: getCommentTool(editor, {
              messagesRaw,
              model: aiProvider.languageModel(modelId),
              writer,
            }),
            table: getTableTool(editor, {
              messagesRaw,
              model: aiProvider.languageModel(modelId),
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
                model: aiProvider.languageModel(modelId),
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
                model: aiProvider.languageModel(modelId),
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

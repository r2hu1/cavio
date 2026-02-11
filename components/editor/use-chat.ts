"use client";

import * as React from "react";

import { type UseChatHelpers, useChat as useBaseChat } from "@ai-sdk/react";
import {
  AIChatPlugin,
  aiCommentToRange,
  applyTableCellSuggestion,
} from "@platejs/ai/react";
import { getCommentKey, getTransientCommentKey } from "@platejs/comment";
import { deserializeMd } from "@platejs/markdown";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { type UIMessage, DefaultChatTransport } from "ai";
import { type TNode, KEYS, nanoid, NodeApi, TextApi } from "platejs";
import { type PlateEditor, useEditorRef, usePluginOption } from "platejs/react";

import { aiChatPlugin } from "@/components/editor/plugins/ai-kit";

import { discussionPlugin } from "./plugins/discussion-kit";
import { withAIBatch } from "@platejs/ai";

export type ToolName = "comment" | "edit" | "generate";

export type TComment = {
  comment: {
    blockId: string;
    comment: string;
    content: string;
  } | null;
  status: "finished" | "streaming";
};

export type TTableCellUpdate = {
  cellUpdate: {
    content: string;
    id: string;
  } | null;
  status: "finished" | "streaming";
};

export type MessageDataPart = {
  toolName: ToolName;
  comment?: TComment;
  table?: TTableCellUpdate;
};

export type Chat = UseChatHelpers<ChatMessage>;

export type ChatMessage = UIMessage<{}, MessageDataPart>;

export const useChat = () => {
  const editor = useEditorRef();
  const options = usePluginOption(aiChatPlugin, "chatOptions");

  // remove when you implement the route /api/ai/command
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const _abortFakeStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const baseChat = useBaseChat<ChatMessage>({
    id: "editor",
    transport: new DefaultChatTransport({
      api: options.api || "/api/ai/command",
    }),
    onData(data) {
      if (data.type === "data-toolName") {
        editor.setOption(AIChatPlugin, "toolName", data.data as ToolName);
      }

      if (data.type === "data-table" && data.data) {
        const tableData = data.data as TTableCellUpdate;

        if (tableData.status === "finished") {
          const chatSelection = editor.getOption(AIChatPlugin, "chatSelection");

          if (!chatSelection) return;

          editor.tf.setSelection(chatSelection);

          return;
        }

        const cellUpdate = tableData.cellUpdate!;

        withAIBatch(editor, () => {
          applyTableCellSuggestion(editor, cellUpdate);
        });
      }

      if (data.type === "data-comment" && data.data) {
        const commentData = data.data as TComment;

        if (commentData.status === "finished") {
          editor.getApi(BlockSelectionPlugin).blockSelection.deselect();

          return;
        }

        const aiComment = commentData.comment!;
        const range = aiCommentToRange(editor, aiComment);

        if (!range) return console.warn("No range found for AI comment");

        const discussions =
          editor.getOption(discussionPlugin, "discussions") || [];

        // Generate a new discussion ID
        const discussionId = nanoid();

        // Create a new comment
        const newComment = {
          id: nanoid(),
          contentRich: [{ children: [{ text: aiComment.comment }], type: "p" }],
          createdAt: new Date(),
          discussionId,
          isEdited: false,
          userId: editor.getOption(discussionPlugin, "currentUserId"),
        };

        // Create a new discussion
        const newDiscussion = {
          id: discussionId,
          comments: [newComment],
          createdAt: new Date(),
          documentContent: deserializeMd(editor, aiComment.content)
            .map((node: TNode) => NodeApi.string(node))
            .join("\n"),
          isResolved: false,
          userId: editor.getOption(discussionPlugin, "currentUserId"),
        };

        // Update discussions
        const updatedDiscussions = [...discussions, newDiscussion];
        editor.setOption(discussionPlugin, "discussions", updatedDiscussions);

        // Apply comment marks to the editor
        editor.tf.withMerging(() => {
          editor.tf.setNodes(
            {
              [getCommentKey(newDiscussion.id)]: true,
              [getTransientCommentKey()]: true,
              [KEYS.comment]: true,
            },
            {
              at: range,
              match: TextApi.isText,
              split: true,
            },
          );
        });
      }
    },

    ...options,
  });

  const chat = {
    ...baseChat,
    _abortFakeStream,
  };

  React.useEffect(() => {
    editor.setOption(AIChatPlugin, "chat", chat as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.status, chat.messages, chat.error]);

  return chat;
};

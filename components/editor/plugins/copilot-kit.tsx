"use client";

import type { TElement } from "platejs";

import { faker } from "@faker-js/faker";
import { CopilotPlugin } from "@platejs/ai/react";
import { serializeMd, stripMarkdown } from "@platejs/markdown";

import { GhostText } from "@/components/ui/ghost-text";

import { MarkdownKit } from "./markdown-kit";

export const CopilotKit = [
  ...MarkdownKit,
  CopilotPlugin.configure(({ api }) => ({
    options: {
      completeOptions: {
        api: "/api/ai/copilot",
        onError: (e) => {
          console.error(e);
          // Mock the API response. Remove it when you implement the route /api/ai/copilot
          api.copilot.setBlockSuggestion({
            text: stripMarkdown("upgrade to premium to use AI autocomple!"),
          });
        },
        onFinish: (_, completion) => {
          if (completion === "0") return;

          api.copilot.setBlockSuggestion({
            text: stripMarkdown(completion),
          });
        },
      },
      debounceDelay: 1000,
      renderGhostText: GhostText,
      getPrompt: ({ editor }) => {
        const contextEntry = editor.api.block({ highest: true });

        if (!contextEntry) return "";

        const prompt = serializeMd(editor, {
          value: [contextEntry[0] as TElement],
        });

        return `Continue the text up to the next punctuation mark:
  """
  ${prompt}
  """`;
      },
    },
    shortcuts: {
      accept: {
        keys: "tab",
      },
      acceptNextWord: {
        keys: "mod+right",
      },
      reject: {
        keys: "escape",
      },
      triggerSuggestion: {
        keys: "ctrl+space",
      },
    },
  })),
];

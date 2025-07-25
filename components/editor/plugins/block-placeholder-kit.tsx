"use client";

import { KEYS } from "platejs";
import { BlockPlaceholderPlugin } from "platejs/react";

export const BlockPlaceholderKit = [
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        "before:absolute before:cursor-text before:text-muted-foreground/80 before:content-[attr(placeholder)]",
      placeholders: {
        [KEYS.p]: "Use “/” to open tools · Press “space” to trigger AI",
      },
      query: ({ path }) => {
        return path.length === 1;
      },
    },
  }),
];

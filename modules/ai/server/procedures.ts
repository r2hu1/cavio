import { db } from "@/db/client";
import { polarClient } from "@/lib/polar";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { count, desc, eq, inArray } from "drizzle-orm";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { title } from "process";
import { url } from "inspector/promises";
import { aiChatHistory } from "@/db/schema";
import { generateText } from "ai";
import { googleai } from "@/lib/google-ai";
import { isSubscribed } from "@/lib/cache/premium";

export const aiRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string(), typeOfModel: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const isPremium = await isSubscribed();
      if (!isPremium && input.typeOfModel !== "chat") {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: `Upgrade to premium to use AI ${input.typeOfModel}`,
        });
      }
      const res = await generateText({
        model: googleai("models/gemini-2.0-flash") as any,
        prompt: input.content,
        system: `You are a content generator that outputs responses strictly in **MDX** (Markdown + JSX). Use **Markdown syntax** for headings, lists, links, code blocks, and formatting. Use **JSX** for embedding components or interactive elements.

        - Always wrap code blocks in triple backticks and specify the language (e.g., \`\`\`tsx\`, \`\`\`js\`, \`\`\`mdx\`).
        - Avoid plain text outside of Markdown or JSX.
        - When explaining concepts, structure your content with semantic Markdown and enrich it using embedded JSX components.

        ---

        **Example Output:**

        ## Understanding Closures in JavaScript

        A **closure** is a function that retains access to its lexical scope even when executed outside of that scope.

        \`\`\`js
        function outer() {
          const secret = "hello";
          return function inner() {
            console.log(secret);
          };
        }
        const fn = outer();
        fn(); // logs "hello"
        \`\`\`

        <Note>This is a classic example of a closure.</Note>
        `,
      });
      if (!res) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error something went wrong, please try again!",
        });
      }
      return res.text;
    }),
});

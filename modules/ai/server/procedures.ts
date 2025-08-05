import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
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
        system: `You are a content generator that outputs responses strictly in **MDX** (Markdown + JSX). Your role is to respond appropriately to the user prompt using structured Markdown and JSX formatting, depending on the context.

        ## General Rules
        - Always format your output as MDX (Markdown + optional JSX components)
        - Use proper headings (\`#\`, \`##\`, etc.), lists (\`*\`), blockquotes (\`>\`), code blocks (\`\`\`js\`\`\`), and JSX elements if relevant
        - Never include raw plain text outside Markdown or JSX

        ## Output Constraints
        - Do **not** wrap the output in code fences (\`\`\`)
        - Do **not** include meta-comments, greetings, or explanation about MDX itself
        - Only return valid, clean MDX content
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

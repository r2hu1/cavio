import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { googleai } from "@/lib/google-ai";
import { isSubscribed } from "@/lib/cache/premium";
import { db } from "@/db/client";
import { aiChatHistory } from "@/db/schema";
import { eq } from "drizzle-orm";

export const aiRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        typeOfModel: z.string(),
        chatId: z.string().optional(),
      }),
    )
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
        - When you are out of or close to the maximum token limit, gracefully end your response with an appropriate closing statement or summary, ensuring the output remains valid and complete in MDX format.

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
      if (input.chatId) {
        const [currRec] = await db
          .select()
          .from(aiChatHistory)
          .where(eq(aiChatHistory.id, input.chatId));
        if (currRec) {
          await db
            .update(aiChatHistory)
            .set({
              title: currRec.title,
              content: [
                ...((currRec.content as any) || []),
                {
                  role: "user",
                  content: input.content,
                },
                {
                  role: "ai",
                  content: res.text,
                },
              ],
            })
            .where(eq(aiChatHistory.id, input.chatId));
          return {
            text: res.text,
            id: null,
          };
        }
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Error the requested is invalid",
        });
      }
      const [createdRecord] = await db
        .insert(aiChatHistory)
        .values({
          title: input.content.slice(0, 200),
          content: [
            {
              role: "user",
              content: input.content,
            },
            {
              role: "ai",
              content: res.text,
            },
          ],
          userId: ctx.auth.session.userId,
        })
        .returning();
      return {
        text: res.text,
        id: createdRecord.id,
      };
    }),
  getExisting: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [existing] = await db
        .select()
        .from(aiChatHistory)
        .where(eq(aiChatHistory.id, input.chatId));
      if (existing.userId != ctx.auth.session.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "UNAUTHORIZED",
        });
      }
      return existing;
    }),
  history: protectedProcedure.query(async ({ input, ctx }) => {
    const existing = await db
      .select()
      .from(aiChatHistory)
      .where(eq(aiChatHistory.userId, ctx.auth.session.userId));
    return existing;
  }),
  deleteHistory: protectedProcedure
    .input(
      z.object({
        chatId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.chatId) {
        const [existing] = await db
          .delete(aiChatHistory)
          .where(eq(aiChatHistory.id, input.chatId))
          .returning();
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Error the requested is invalid",
          });
        }
        return existing;
      }
      const existing = await db
        .delete(aiChatHistory)
        .where(eq(aiChatHistory.userId, ctx.auth.session.userId))
        .returning();
      return existing;
    }),
});

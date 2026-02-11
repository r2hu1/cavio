import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { db } from "@/db/client";
import { aiChatHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  DOC_AI_SYSTEM_PROMPT,
  FORMAT_PROMPT,
  SYSTEM_PROMPT,
} from "../constants";
import { getApiKey, getModel } from "../views/creds/lib";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const aiRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        typeOfModel: z.string(),
        chatId: z.string().optional(),
        lastResponse: z.string().optional().default(""),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const key = await getApiKey();
      const model = await getModel();
      if (!key) {
        return {
          text: "No API key found, please set it in the [settings](/settings/preferences).",
          id: null,
        };
      }
      const memories = `
		 <Memory>
		  <User>
		   <Avatar>${ctx.auth.user.image}</Avatar>
		   <Name>${ctx.auth.user.name}</Name>
		   <Email>${ctx.auth.user.email}</Email>
		   <EmailVerified>${ctx.auth.user.emailVerified}</EmailVerified>
		   <Id>${ctx.auth.user.id}</Id>
		  </User>
				<YourLastResponse>${input.lastResponse}</YourLastResponse>
				<Waring>Always use memory if necessary</Waring>
				<Waring>Only use your last response if it is relevant to the current conversation</Waring>
		 </Memory>
			`;
      const googleai = createGoogleGenerativeAI({
        apiKey: key || "",
      });
      const res = await generateText({
        model: googleai(`models/${model}`) as any,
        prompt: `
          ${input.content}
          `,
        system: `${SYSTEM_PROMPT}\n\n${memories}`,
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
  documentAiChatCreate: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        lastEditedDocContent: z.string().optional().default(""),
        title: z.string(),
        previous: z.string().optional().default(""),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const key = await getApiKey();
      const model = await getModel();
      if (!key) {
        return {
          text: "No API key found, please set it in the settings.",
        };
      }
      const memoryContext = `
		<Memory>
		<Warning>Always use memory if necessary</Warning>
		<YourPreviousMinifiedResponse>${input.previous}</YourPreviousMinifiedResponse>
			<User>
			  id: ${ctx.auth.user.id}
				name: ${ctx.auth.user.name}
				email: ${ctx.auth.user.email}
			</User>
			<Document>
			<Title>${input.title}</Title>
			  <LastEditedContent>
			    ${input.lastEditedDocContent ?? ""}
			  </LastEditedContent>
			</Document>
		</Memory>
    `.trim();

      const googleai = createGoogleGenerativeAI({
        apiKey: key || "",
      });
      const res = await generateText({
        model: googleai(`models/${model}`) as any,
        system: `${DOC_AI_SYSTEM_PROMPT}\n\n${memoryContext}`,
        prompt: input.content,
      });

      if (!res) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error something went wrong, please try again!",
        });
      }

      return {
        text: res.text,
      };
    }),
});

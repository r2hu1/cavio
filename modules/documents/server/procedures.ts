import { db } from "@/db/client";
import { documents } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { count, eq } from "drizzle-orm";
import z from "zod";
import { documentSchema } from "../schema";
import { TRPCError } from "@trpc/server";
import { title } from "process";

export const documentsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ input, ctx }) => {
    const document = await db
      .select()
      .from(documents)
      .where(eq(documents.userId, ctx.auth.user.id));
    return document;
  }),
  create: premiumProcedure("document")
    .input(documentSchema)
    .mutation(async ({ input, ctx }) => {
      const [document] = await db
        .insert(documents)
        .values({ ...input, userId: ctx.auth.user.id })
        .returning();
      return document;
    }),
  getAllByFolderId: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.folderId, input.folderId));
      if (document.length > 0 && document[0].userId !== ctx.auth.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "UNAUTHORIZED",
        });
      return document;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));
      if (document.length > 0 && document[0].userId !== ctx.auth.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "UNAUTHORIZED",
        });
      const deletedDocument = await db
        .delete(documents)
        .where(eq(documents.id, input.id))
        .returning();
      return deletedDocument;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));
      if (document.length > 0 && document[0].userId !== ctx.auth.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "UNAUTHORIZED",
        });
      const isContent = input.content !== undefined;
      const [updatedDocument] = await db
        .update(documents)
        .set({
          title: input.title,
          content: isContent ? input.content : document[0].content,
        })
        .where(eq(documents.id, input.id))
        .returning();
      return [updatedDocument];
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));
      if (document.length > 0 && document[0].userId !== ctx.auth.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "UNAUTHORIZED",
        });
      return document[0];
    }),
});

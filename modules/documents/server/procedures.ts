import { db } from "@/db/client";
import { documents, folders } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { count, eq, inArray } from "drizzle-orm";
import z from "zod";
import { documentSchema } from "../schema";
import { TRPCError } from "@trpc/server";
import { title } from "process";
import { url } from "inspector/promises";

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
      const existingFolder = await db
        .select()
        .from(folders)
        .where(eq(folders.id, document.folderId))
        .then((rows) => rows[0]);
      if (!existingFolder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }
      const [updatedFolder] = await db
        .update(folders)
        .set({ documents: [...(existingFolder.documents ?? []), document.id] })
        .where(eq(folders.id, document.folderId))
        .returning();
      return document;
    }),
  getAllByFolderId: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ input, ctx }) => {
      const [folder] = await db
        .select()
        .from(folders)
        .where(eq(folders.id, input.folderId));
      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }
      const documentIds = folder.documents ?? [];
      const fullDocuments = await db
        .select()
        .from(documents)
        .where(inArray(documents.id, documentIds));
      return fullDocuments;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), folderId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));

      if (!document.length)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });

      if (document[0].userId !== ctx.auth.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to delete this document",
        });

      const [folder] = await db
        .select()
        .from(folders)
        .where(eq(folders.id, input.folderId));

      if (!folder)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });

      const updatedDocuments = (folder.documents ?? []).filter(
        (docId) => docId !== input.id,
      );

      await db
        .update(folders)
        .set({ documents: updatedDocuments })
        .where(eq(folders.id, input.folderId));

      const [deletedDocument] = await db
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
        isPublished: z.boolean().optional().default(false),
        privacy: z.string().optional().default("private"),
        collaborators: z.array(z.string()).optional().default([]),
        url: z.string().optional().default(""),
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
      const isPrivacy = input.privacy !== undefined;
      const isCollaborators = input.collaborators !== undefined;
      const isUrl = input.url !== undefined;
      const isPublished = input.isPublished !== undefined;

      const [updatedDocument] = await db
        .update(documents)
        .set({
          title: input.title,
          content: isContent ? input.content : document[0].content,
          isPublished: isPublished
            ? input.isPublished
            : document[0].isPublished,
          privacy: isPrivacy ? input.privacy : document[0].privacy,
          collaborators: isCollaborators
            ? [
                ...(document[0].collaborators ?? []),
                ...(Array.isArray(input.collaborators)
                  ? input.collaborators
                  : [input.collaborators]),
              ]
            : document[0].collaborators,
          url: isUrl ? input.url : document[0].url,
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
      if (document.length < 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "NOT_FOUND",
        });
      }
      if (document.length > 0 && document[0].userId !== ctx.auth.user.id)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "UNAUTHORIZED",
        });
      return document[0];
    }),
});

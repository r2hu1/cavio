import { db } from "@/db/client";
import { documents, folders } from "@/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/init";
import { and, desc, eq, inArray, isNotNull, lt } from "drizzle-orm";
import z from "zod";
import { documentSchema } from "../schema";
import { TRPCError } from "@trpc/server";

export const documentsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ input, ctx }) => {
    const document = await db
      .select({
        id: documents.id,
        title: documents.title,
        folderId: documents.folderId,
        userId: documents.userId,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
      })
      .from(documents)
      .where(
        and(
          eq(documents.userId, ctx.auth.session.userId),
          eq(documents.deleted, false)
        )
      );
    return document;
  }),
  create: protectedProcedure
    .input(documentSchema)
    .mutation(async ({ input, ctx }) => {
      const [document] = await db
        .insert(documents)
        .values({
          title: input.title,
          folderId: input.folderId,
          content: input.content || "",
          userId: ctx.auth.session.userId,
        })
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
        .where(
          and(
            eq(folders.id, input.folderId),
            eq(folders.deleted, false)
          )
        );
      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }
      const documentIds = folder.documents ?? [];
      if (documentIds.length === 0) {
        return [];
      }
      const fullDocuments = await db
        .select({
          id: documents.id,
          title: documents.title,
          updatedAt: documents.updatedAt,
          userId: documents.userId,
          folderId: documents.folderId,
          createdAt: documents.createdAt,
        })
        .from(documents)
        .where(
          and(
            inArray(documents.id, documentIds),
            eq(documents.deleted, false)
          )
        );
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

      if (document[0].userId !== ctx.auth.session.userId)
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

      // Soft delete - mark as deleted instead of removing
      const [deletedDocument] = await db
        .update(documents)
        .set({ 
          deleted: true,
          deletedAt: new Date(),
        })
        .where(eq(documents.id, input.id))
        .returning();

      return deletedDocument;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().optional(),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));

      if (document.length > 0 && document[0].userId !== ctx.auth.session.userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "UNAUTHORIZED",
        });

      const [updatedDocument] = await db
        .update(documents)
        .set({
          content: input.content || document[0].content,
          title: input.title || document[0].title,
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
      if (document.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "NOT_FOUND",
        });
      }
      if (document.length > 0 && document[0].userId !== ctx.auth.session.userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "UNAUTHORIZED",
        });
      return document[0];
    }),
  getRecent: protectedProcedure.query(async ({ ctx }) => {
    const document = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.userId, ctx.auth.session.userId),
          eq(documents.deleted, false)
        )
      )
      .orderBy(desc(documents.updatedAt))
      .limit(6);

    return document;
  }),
  getShared: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));
      if (document.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }
      if (!document[0].isPublished) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This document is not shared publicly",
        });
      }
      return document[0];
    }),
  toggleShare: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isPublished: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));

      if (document.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }

      if (document[0].userId !== ctx.auth.session.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to share this document",
        });
      }

      const shareUrl = input.isPublished
        ? `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/share/${input.id}`
        : "";

      const [updatedDocument] = await db
        .update(documents)
        .set({
          isPublished: input.isPublished,
          url: shareUrl,
          privacy: input.isPublished ? "public" : "private",
        })
        .where(eq(documents.id, input.id))
        .returning();

      return updatedDocument;
    }),
  clone: protectedProcedure
    .input(
      z.object({
        documentId: z.string(),
        folderId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const sourceDoc = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.documentId));

      if (sourceDoc.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Source document not found",
        });
      }

      if (!sourceDoc[0].isPublished) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot clone a private document",
        });
      }

      const targetFolder = await db
        .select()
        .from(folders)
        .where(eq(folders.id, input.folderId));

      if (targetFolder.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Target folder not found",
        });
      }

      if (targetFolder[0].userId !== ctx.auth.session.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to add documents to this folder",
        });
      }

      const [newDocument] = await db
        .insert(documents)
        .values({
          title: `${sourceDoc[0].title} (Copy)`,
          content: sourceDoc[0].content,
          folderId: input.folderId,
          userId: ctx.auth.session.userId,
          isPublished: false,
          privacy: "private",
          url: "",
        })
        .returning();

      const [updatedFolder] = await db
        .update(folders)
        .set({
          documents: [...(targetFolder[0].documents ?? []), newDocument.id],
        })
        .where(eq(folders.id, input.folderId))
        .returning();

      return newDocument;
    }),
  export: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        format: z.enum(["json", "mdx", "pdf"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));

      if (document.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }

      if (document[0].userId !== ctx.auth.session.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to export this document",
        });
      }

      const doc = document[0];
      let content = "";
      let filename = "";
      let mimeType = "";

      switch (input.format) {
        case "json":
          content = JSON.stringify(
            {
              title: doc.title,
              content: doc.content,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
            },
            null,
            2,
          );
          filename = `${doc.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
          mimeType = "application/json";
          break;

        case "mdx":
          content = `# ${doc.title}\n\n${doc.content}`;
          filename = `${doc.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.mdx`;
          mimeType = "text/markdown";
          break;

        case "pdf":
          content = `${doc.title}\n\n${doc.content}`;
          filename = `${doc.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
          mimeType = "text/plain";
          break;
      }

      return {
        content,
        filename,
        mimeType,
      };
    }),
  getDeleted: protectedProcedure.query(async ({ ctx }) => {
    const deletedDocuments = await db
      .select()
      .from(documents)
      .where(
        and(
          eq(documents.userId, ctx.auth.session.userId),
          eq(documents.deleted, true)
        )
      )
      .orderBy(desc(documents.deletedAt));

    return deletedDocuments;
  }),
  restore: protectedProcedure
    .input(z.object({ id: z.string(), folderId: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));

      if (document.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }

      if (document[0].userId !== ctx.auth.session.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to restore this document",
        });
      }

      const updateData: any = {
        deleted: false,
        deletedAt: null,
      };

      // If a new folder ID is provided, move the document there
      if (input.folderId) {
        updateData.folderId = input.folderId;
        
        // Add document to new folder's documents array
        const [newFolder] = await db
          .select()
          .from(folders)
          .where(eq(folders.id, input.folderId));
          
        if (newFolder) {
          await db
            .update(folders)
            .set({
              documents: [...(newFolder.documents ?? []), input.id],
            })
            .where(eq(folders.id, input.folderId));
        }
      }

      const [restoredDocument] = await db
        .update(documents)
        .set(updateData)
        .where(eq(documents.id, input.id))
        .returning();

      return restoredDocument;
    }),
  permanentDelete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));

      if (document.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }

      if (document[0].userId !== ctx.auth.session.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to delete this document",
        });
      }

      const [deletedDocument] = await db
        .delete(documents)
        .where(eq(documents.id, input.id))
        .returning();

      return deletedDocument;
    }),
  getParentFolderStatus: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const document = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));

      if (document.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }

      if (document[0].userId !== ctx.auth.session.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      const folderId = document[0].folderId;
      const [parentFolder] = await db
        .select()
        .from(folders)
        .where(eq(folders.id, folderId));

      // Get available folders for moving the document
      const availableFolders = await db
        .select({
          id: folders.id,
          title: folders.title,
        })
        .from(folders)
        .where(
          and(
            eq(folders.userId, ctx.auth.session.userId),
            eq(folders.deleted, false)
          )
        )
        .orderBy(folders.title);

      return {
        parentFolder: parentFolder
          ? {
              id: parentFolder.id,
              title: parentFolder.title,
              deleted: parentFolder.deleted,
            }
          : null,
        availableFolders,
      };
    }),
  restoreAll: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.session.userId;

    // Restore all deleted documents for this user
    const restoredDocuments = await db
      .update(documents)
      .set({
        deleted: false,
        deletedAt: null,
      })
      .where(
        and(
          eq(documents.userId, userId),
          eq(documents.deleted, true)
        )
      )
      .returning();

    return {
      restoredCount: restoredDocuments.length,
      restoredDocuments,
    };
  }),
  permanentDeleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.session.userId;

    // Permanently delete all deleted documents for this user
    const deletedDocuments = await db
      .delete(documents)
      .where(
        and(
          eq(documents.userId, userId),
          eq(documents.deleted, true)
        )
      )
      .returning();

    return {
      deletedCount: deletedDocuments.length,
    };
  }),
});

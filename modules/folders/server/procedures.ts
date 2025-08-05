import { db } from "@/db/client";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { desc, eq } from "drizzle-orm";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { folders } from "@/db/schema";
import {
  foldersSchema,
  getFoldersByIdSchema,
  updateFoldersByIdSchema,
} from "../schema";

export const foldersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ input, ctx }) => {
    const currentFolders = await db
      .select()
      .from(folders)
      .where(eq(folders.userId, ctx.auth.session.userId))
      .orderBy(desc(folders.updatedAt));
    return currentFolders;
  }),
  create: premiumProcedure("folder")
    .input(foldersSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdFolder] = await db
        .insert(folders)
        .values({
          title: input.title,
          userId: ctx.auth.session.userId,
        })
        .returning();
      return createdFolder;
    }),
  getById: protectedProcedure
    .input(getFoldersByIdSchema)
    .query(async ({ input, ctx }) => {
      const [folder] = await db
        .select()
        .from(folders)
        .where(eq(folders.id, input.id));
      if (!folder)
        throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
      if (folder.userId != ctx.auth.session.userId)
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      return folder;
    }),
  delete: protectedProcedure
    .input(getFoldersByIdSchema)
    .mutation(async ({ input, ctx }) => {
      const [deletedFolder] = await db
        .delete(folders)
        .where(eq(folders.id, input.id))
        .returning();
      if (!deletedFolder)
        throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
      if (deletedFolder.userId != ctx.auth.session.userId)
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      return deletedFolder;
    }),
  update: protectedProcedure
    .input(updateFoldersByIdSchema)
    .mutation(async ({ input, ctx }) => {
      const existingFolder = await db.query.folders.findFirst({
        where: (folders, { eq }) => eq(folders.id, input.id),
      });
      if (!existingFolder) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
      }
      if (existingFolder.userId !== ctx.auth.session.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      const updatedData: Partial<typeof folders.$inferInsert> = {
        title: input.title,
      };
      if (input.documents) {
        updatedData.documents = [
          ...(existingFolder.documents ?? []),
          input.documents,
        ];
      }
      const [updatedFolder] = await db
        .update(folders)
        .set(updatedData)
        .where(eq(folders.id, input.id))
        .returning();
      if (!updatedFolder) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
      }
      return updatedFolder;
    }),
  getRecent: protectedProcedure.query(async ({ ctx }) => {
    const recentFolders = await db
      .select()
      .from(folders)
      .where(eq(folders.userId, ctx.auth.session.userId))
      .orderBy(desc(folders.updatedAt))
      .limit(6);
    return recentFolders;
  }),
});

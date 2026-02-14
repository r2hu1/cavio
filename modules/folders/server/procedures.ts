import { db } from "@/db/client";
import { documents, folders } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray } from "drizzle-orm";
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
			.where(
				and(
					eq(folders.userId, ctx.auth.session.userId),
					eq(folders.deleted, false),
				),
			)
			.orderBy(desc(folders.updatedAt));
		return currentFolders;
	}),
	create: protectedProcedure
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
				.where(and(eq(folders.id, input.id), eq(folders.deleted, false)));
			if (!folder)
				throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
			if (folder.userId != ctx.auth.session.userId)
				throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
			return folder;
		}),
	delete: protectedProcedure
		.input(getFoldersByIdSchema)
		.mutation(async ({ input, ctx }) => {
			const [folder] = await db
				.select()
				.from(folders)
				.where(eq(folders.id, input.id));

			if (!folder)
				throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
			if (folder.userId != ctx.auth.session.userId)
				throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

			const now = new Date();

			// Soft delete all documents inside the folder
			const documentIds = folder.documents ?? [];
			if (documentIds.length > 0) {
				await db
					.update(documents)
					.set({
						deleted: true,
						deletedAt: now,
					})
					.where(inArray(documents.id, documentIds));
			}

			// Soft delete the folder
			const [deletedFolder] = await db
				.update(folders)
				.set({
					deleted: true,
					deletedAt: now,
				})
				.where(eq(folders.id, input.id))
				.returning();

			return deletedFolder;
		}),
	update: protectedProcedure
		.input(updateFoldersByIdSchema)
		.mutation(async ({ input, ctx }) => {
			const [existingFolder] = await db
				.select()
				.from(folders)
				.where(eq(folders.id, input.id));
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
			.where(
				and(
					eq(folders.userId, ctx.auth.session.userId),
					eq(folders.deleted, false),
				),
			)
			.orderBy(desc(folders.updatedAt))
			.limit(6);
		return recentFolders;
	}),
	getDeleted: protectedProcedure.query(async ({ ctx }) => {
		const deletedFolders = await db
			.select()
			.from(folders)
			.where(
				and(
					eq(folders.userId, ctx.auth.session.userId),
					eq(folders.deleted, true),
				),
			)
			.orderBy(desc(folders.deletedAt));
		return deletedFolders;
	}),
	restore: protectedProcedure
		.input(getFoldersByIdSchema)
		.mutation(async ({ input, ctx }) => {
			const [folder] = await db
				.select()
				.from(folders)
				.where(eq(folders.id, input.id));

			if (!folder) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
			}
			if (folder.userId != ctx.auth.session.userId) {
				throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
			}

			// Restore all documents inside the folder
			const documentIds = folder.documents ?? [];
			if (documentIds.length > 0) {
				await db
					.update(documents)
					.set({
						deleted: false,
						deletedAt: null,
					})
					.where(inArray(documents.id, documentIds));
			}

			// Restore the folder
			const [restoredFolder] = await db
				.update(folders)
				.set({
					deleted: false,
					deletedAt: null,
				})
				.where(eq(folders.id, input.id))
				.returning();

			return restoredFolder;
		}),
	permanentDelete: protectedProcedure
		.input(getFoldersByIdSchema)
		.mutation(async ({ input, ctx }) => {
			const [folder] = await db
				.select()
				.from(folders)
				.where(eq(folders.id, input.id));

			if (!folder) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
			}
			if (folder.userId != ctx.auth.session.userId) {
				throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
			}

			const [deletedFolder] = await db
				.delete(folders)
				.where(eq(folders.id, input.id))
				.returning();

			return deletedFolder;
		}),
	restoreAll: protectedProcedure.mutation(async ({ ctx }) => {
		const userId = ctx.auth.session.userId;

		// Restore all deleted folders and their documents for this user
		const deletedFoldersList = await db
			.select()
			.from(folders)
			.where(and(eq(folders.userId, userId), eq(folders.deleted, true)));

		// Restore documents in all deleted folders
		for (const folder of deletedFoldersList) {
			const documentIds = folder.documents ?? [];
			if (documentIds.length > 0) {
				await db
					.update(documents)
					.set({
						deleted: false,
						deletedAt: null,
					})
					.where(inArray(documents.id, documentIds));
			}
		}

		// Restore all folders
		const restoredFolders = await db
			.update(folders)
			.set({
				deleted: false,
				deletedAt: null,
			})
			.where(and(eq(folders.userId, userId), eq(folders.deleted, true)))
			.returning();

		return {
			restoredCount: restoredFolders.length,
			restoredFolders,
		};
	}),
	permanentDeleteAll: protectedProcedure.mutation(async ({ ctx }) => {
		const userId = ctx.auth.session.userId;

		// Get all deleted folders with their documents
		const deletedFoldersList = await db
			.select()
			.from(folders)
			.where(and(eq(folders.userId, userId), eq(folders.deleted, true)));

		// Delete all documents in deleted folders
		for (const folder of deletedFoldersList) {
			const documentIds = folder.documents ?? [];
			if (documentIds.length > 0) {
				await db.delete(documents).where(inArray(documents.id, documentIds));
			}
		}

		// Permanently delete all deleted folders for this user
		const deletedFoldersResult = await db
			.delete(folders)
			.where(and(eq(folders.userId, userId), eq(folders.deleted, true)))
			.returning();

		return {
			deletedCount: deletedFoldersResult.length,
		};
	}),
});

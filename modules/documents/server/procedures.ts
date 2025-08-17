import { db } from "@/db/client";
import { documents, folders } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { desc, eq, inArray } from "drizzle-orm";
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
			.where(eq(documents.userId, ctx.auth.session.userId));
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
			if (document.length < 0) {
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
			.where(eq(documents.userId, ctx.auth.session.userId))
			.orderBy(desc(documents.updatedAt))
			.limit(6);

		return document;
	}),
});

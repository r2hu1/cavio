import { db } from "@/db/client";
import { documents, folders } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function cleanupDeletedItems() {
	const oneWeekAgo = new Date(Date.now() - ONE_WEEK_MS);

	// Delete old documents
	const deletedDocs = await db
		.delete(documents)
		.where(
			and(eq(documents.deleted, true), lt(documents.deletedAt, oneWeekAgo)),
		)
		.returning();

	// Delete old folders
	const deletedFolders = await db
		.delete(folders)
		.where(and(eq(folders.deleted, true), lt(folders.deletedAt, oneWeekAgo)))
		.returning();

	return {
		documentsDeleted: deletedDocs.length,
		foldersDeleted: deletedFolders.length,
	};
}

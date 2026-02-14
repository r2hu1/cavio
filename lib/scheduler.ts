import cron from "node-cron";
import { cleanupDeletedItems } from "./cleanup";

// Run cleanup every day at midnight
export function startCleanupScheduler() {
	console.log("Starting cleanup scheduler...");

	// Schedule: 0 0 * * * = At 00:00 (midnight) every day
	const task = cron.schedule("0 0 * * *", async () => {
		console.log("[Cleanup] Running scheduled cleanup job...");
		try {
			const result = await cleanupDeletedItems();
			console.log(
				`[Cleanup] Completed. Deleted ${result.documentsDeleted} documents and ${result.foldersDeleted} folders.`,
			);
		} catch (error) {
			console.error("[Cleanup] Scheduled cleanup failed:", error);
		}
	});

	// Also run cleanup immediately on startup
	console.log("[Cleanup] Running initial cleanup on startup...");
	cleanupDeletedItems()
		.then((result) => {
			console.log(
				`[Cleanup] Initial cleanup completed. Deleted ${result.documentsDeleted} documents and ${result.foldersDeleted} folders.`,
			);
		})
		.catch((error) => {
			console.error("[Cleanup] Initial cleanup failed:", error);
		});

	return task;
}

import { startCleanupScheduler } from "@/lib/scheduler";

// Start the cleanup scheduler on server startup
if (typeof window === "undefined") {
	startCleanupScheduler();
}

export function SchedulerInitializer() {
	// This component doesn't render anything
	// It just initializes the scheduler on the server
	return null;
}

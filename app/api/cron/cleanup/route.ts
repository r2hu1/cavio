import { NextResponse } from "next/server";
import { cleanupDeletedItems } from "@/lib/cleanup";

export async function POST(request: Request) {
	// Verify cron secret to prevent unauthorized access
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const result = await cleanupDeletedItems();
		return NextResponse.json({
			success: true,
			...result,
		});
	} catch (error) {
		console.error("Cleanup failed:", error);
		return NextResponse.json(
			{ error: "Cleanup failed" },
			{ status: 500 }
		);
	}
}

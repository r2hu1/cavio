"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.log(error.message);
	}, [error]);

	return (
		<div className="flex justify-center items-center absolute px-6 w-full bottom-10 top-14 left-0">
			<div className="text-center space-y-3 max-w-lg">
				<h2 className="text-xl font-medium">{error.message}</h2>
				<p className="text-base sm:text-lg text-foreground/80">
					Error something went wrong, the above message might help you identify
					the issue.
				</p>
				<div className="flex flex-wrap items-center justify-center !mt-7 gap-3">
					<Button asChild variant="outline">
						<Link
							target="_blank"
							href="https://github.com/r2hu1/cavio/issues/new"
						>
							Report <AlertCircle className="!h-4 !w-4" />
						</Link>
					</Button>
					<Button onClick={() => reset()}>
						Try again <RefreshCcw className="!h-4 !w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

"use client";
import { authClient } from "@/lib/auth-client";
import { Session } from "better-auth";
import { useEffect, useState } from "react";
import SessionCard from "./session-card";
import SessionPageNav from "./session-page-nav";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function SessionsPageView() {
	const [sessions, setSessions] = useState<Session[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [revokingAll, setRevokingAll] = useState(false);

	const fetchSessions = async () => {
		setLoading(true);
		const actsessions = await authClient.listSessions();
		if (actsessions) {
			setSessions(actsessions?.data);
		}
		setLoading(false);
	};
	useEffect(() => {
		fetchSessions();
	}, []);

	const revokeOtherSessions = async () => {
		setRevokingAll(true);
		await authClient.revokeOtherSessions();
		setRevokingAll(false);
		fetchSessions();
	};

	return (
		<div>
			<SessionPageNav active={"sessions"} />
			<div className="mb-10 flex gap-2 items-center justify-between">
				<div>
					<h1 className="font-medium text-lg">Active Sessions</h1>
					<p className="text-sm text-foreground/80">
						Manage your active sessions across devices
					</p>
				</div>
				<Button disabled={revokingAll} size="sm" onClick={revokeOtherSessions}>
					Revoke All Other{" "}
					{!revokingAll ? (
						<AlertTriangle className="!h-3.5 !w-3.5" />
					) : (
						<Loader2 className="!h-3.5 !w-3.5 animate-spin" />
					)}
				</Button>
			</div>
			<div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
				{!loading &&
					sessions?.map((session) => (
						<SessionCard
							key={session.id}
							session={session}
							onRevokeCallback={fetchSessions}
						/>
					))}
				{loading &&
					Array.from({ length: 2 }).map(() => (
						<Skeleton className="col-span-3 h-[280px] w-full" />
					))}
			</div>
		</div>
	);
}

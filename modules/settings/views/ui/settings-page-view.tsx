"use client";

import { Loader } from "@/components/ai-elements/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useAuthState } from "@/modules/auth/providers/auth-context";
import { useState } from "react";
import { toast } from "sonner";
import SessionPageNav from "./settings-page-nav";

export default function SettingsPageView() {
	const { data, isPending } = useAuthState();
	const [sending, setSending] = useState(false);

	const sendVerificationEmail = async () => {
		if (data?.user?.emailVerified) return;
		setSending(true);
		try {
			const res = await authClient.sendVerificationEmail({
				email: data.user.email,
				callbackURL: "/",
			});
			toast.success("Verification email sent");
		} catch (error: any) {
			toast.error("Error", error.message);
		} finally {
			setSending(false);
		}
	};

	return (
		<div>
			<SessionPageNav active={"account"} />
			<div className="mb-10 flex items-center justify-between">
				<div>
					<h1 className="font-medium text-lg">Personal Info</h1>
					<p className="text-sm text-foreground/80">
						Manage your personal information
					</p>
				</div>
				{!data?.user?.emailVerified && (
					<Button
						size="sm"
						onClick={sendVerificationEmail}
						disabled={data?.user?.emailVerified || sending}
					>
						{sending && <Loader className="h-4 w-4" />} Verify Email
					</Button>
				)}
			</div>
			<div className="grid gap-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-5">
						<img className="rounded-3xl h-20 w-20" src={data?.user?.image} />
						<div className="space-y-0.5">
							<h1 className="text-lg font-medium">{data?.user?.name}</h1>
							<h2 className="text-base -mt-1 text-foreground/80">
								{data?.user?.email}
							</h2>
							<Badge>
								{data?.user?.emailVerified ? "Verified" : "Unverified"}
							</Badge>
							{}
						</div>
					</div>
					<div>
						<h1 className="text-sm text-left">Joined On</h1>
						<p className="text-foreground/80 text-sm">
							{new Date(data?.user?.createdAt).toLocaleDateString()}
						</p>
					</div>
				</div>
				<div className="w-full hidden max-w-sm">
					<div className="flex items-center gap-3">
						<div className="space-y-2">
							<Label>Name</Label>
							<Input defaultValue={data?.user?.name} />
						</div>
						<div className="space-y-2">
							<Label>Email</Label>
							<Input defaultValue={data?.user?.email} />
						</div>
					</div>
					<Button className="w-full">Save</Button>
				</div>
			</div>
		</div>
	);
}

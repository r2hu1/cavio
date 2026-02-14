"use client";

import SharedLogo from "@/components/shared-logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { authClient } from "@/lib/auth-client";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ForgotPassword() {
	const params = useSearchParams();
	const emailFromQuery = params.get("email") || "";
	const [email, setEmail] = useState(emailFromQuery);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const { error } = await authClient.requestPasswordReset({
			email: email,
			redirectTo: `${window.location.origin}/auth/reset-password`,
		});
		setLoading(false);
		if (error) {
			setMessage("Account not found!");
		} else {
			setMessage("Check your email for the reset link.");
		}
		setEmail("");
	};

	return (
		<div className="w-full max-w-sm grid gap-6">
			<SharedLogo />
			<Card>
				<CardHeader>
					<h1 className="text-xl text-center font-bold">Forgot Password?</h1>
					<p className="text-sm text-foreground/80 text-center">
						Enter your email address and we&apos;ll send you a link to reset
						your password.
					</p>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<Input
							type="email"
							required
							value={email}
							placeholder="name@domain.com"
							onChange={(e) => setEmail(e.target.value)}
							className="w-full border"
						/>
						{message && (
							<Alert variant="destructive">
								<AlertCircle />
								<AlertDescription>{message}</AlertDescription>
							</Alert>
						)}
						<div className="grid w-full items-center sm:grid-cols-2 gap-2">
							<Button disabled={loading} type="submit">
								{!loading ? "Send" : <Loader className="h-4 w-4 " />}
							</Button>
							<Button type="button" variant="secondary" asChild>
								<Link
									href="/auth/sign-in"
									className="text-sm text-foreground/80 text-center"
								>
									Back to Sign In
								</Link>
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

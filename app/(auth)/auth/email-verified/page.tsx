import VerifiedEmail from "@/modules/auth/views/ui/verified-email-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import type { Metadata } from "next";
import Head from "next/head";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Email Verified Successfully",
	description:
		"Your email has been verified. You can now sign in and enjoy full access to your account",
};

export default function EmailVerifiedPage() {
	return (
		<>
			<Head>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<Suspense fallback={<PageLoader />}>
				<VerifiedEmail />
			</Suspense>
		</>
	);
}

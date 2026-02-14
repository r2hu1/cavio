import SignUpForm from "@/modules/auth/views/ui/sign-up-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Create an Account",
	description:
		"Join us today by creating a free account. Sign up to explore exclusive features and stay connected.",
};

export default function SignUpPage() {
	return <SignUpForm />;
}

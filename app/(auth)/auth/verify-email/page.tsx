import VerifyEmail from "@/modules/auth/views/ui/verify-email-view";
import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description:
    "Please verify your email address to complete your registration and secure your account. Check your inbox for the verification link.",
};

export default function VerifyEmailPage() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <VerifyEmail />
    </>
  );
}

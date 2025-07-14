import VerifyEmail from "@/modules/auth/views/ui/verify-email-view";
import Head from "next/head";

export const metadata = {
  title: "Verify Your Email - Secure Your Account",
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

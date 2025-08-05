import ForgotPassword from "@/modules/auth/views/ui/forgot-password-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Recover your account by resetting your password. Enter your email to receive a secure password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ForgotPassword />
    </Suspense>
  );
}

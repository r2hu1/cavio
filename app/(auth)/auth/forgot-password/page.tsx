import ForgotPassword from "@/modules/auth/views/ui/forgot-password-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Suspense } from "react";

export const metadata = {
  title: "Forgot Password - Reset Your Account Access",
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

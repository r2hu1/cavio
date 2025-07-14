import ForgotPassword from "@/modules/auth/views/ui/forgot-password-view";
import { Suspense } from "react";

export const metadata = {
  title: "Forgot Password - Reset Your Account Access",
  description:
    "Recover your account by resetting your password. Enter your email to receive a secure password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}

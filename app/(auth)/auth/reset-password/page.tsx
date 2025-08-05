import ResetPassword from "@/modules/auth/views/ui/reset-password-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Your Password",
  description:
    "Set a new password to regain secure access to your account. Enter a strong password to protect your data.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResetPassword />
    </Suspense>
  );
}

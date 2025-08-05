import SignInForm from "@/modules/auth/views/ui/sign-in-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In to Your Account",
  description:
    "Access your dashboard by signing in with your email and password. Secure and fast login to your account.",
};

export default function SignInPage() {
  return <SignInForm />;
}

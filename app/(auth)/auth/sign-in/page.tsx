import SignInForm from "@/modules/auth/views/ui/sign-in-view";

export const metadata = {
  title: "Sign In to Your Account",
  description:
    "Access your dashboard by signing in with your email and password. Secure and fast login to your account.",
};

export default function SignInPage() {
  return <SignInForm />;
}

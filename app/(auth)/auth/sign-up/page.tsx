import SignUpForm from "@/modules/auth/views/ui/sign-up-view";

export const metadata = {
  title: "Create an Account",
  description:
    "Join us today by creating a free account. Sign up to explore exclusive features and stay connected.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}

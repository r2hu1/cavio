"use client";
import { Button } from "@/components/ui/button";
import { AlertCircle, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function EmailVerifiedPage() {
  const params = useSearchParams();
  if (params.get("error")) {
    return (
      <div className="max-w-sm space-y-2 text-center">
        <AlertCircle className="h-10 w-10 mx-auto" />
        <h1 className="text-xl sm:text-3xl font-bold">
          Invalid or Expired Link
        </h1>
        <p className="text-base sm:text-lg text-foreground/80">
          The link you followed may be invalid or expired. Please try signing up
          or signing again.
        </p>
        <Button asChild className="w-full mt-2">
          <Link href="/auth/sign-up">Back to Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-sm space-y-2 text-center">
      <CircleCheckBig className="h-10 w-10 mx-auto" />
      <h1 className="text-3xl font-bold">Email Verified</h1>
      <p className="text-base sm:text-lg text-foreground/80">
        Your email has been verified. Sign in to your account to continue.
      </p>
      <Button asChild className="w-full mt-2">
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}

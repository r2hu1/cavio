"use client";
import { Button } from "@/components/ui/button";
import { AlertCircle, CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="max-w-sm space-y-2 text-center">
      <CircleCheckBig className="h-10 w-10 mx-auto" />
      <h1 className="sm:text-3xl text-xl font-bold">Check Your Email</h1>
      <p className="text-sm sm:text-lg text-foreground/80">
        We have sent you an email with a verification link. Please check your
        inbox and click the link to verify your email address.
      </p>
      <Button asChild className="w-full mt-2">
        <Link href="/auth/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}

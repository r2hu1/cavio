"use client";

import { useState } from "react";
import { forgetPassword } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const params = useSearchParams();
  const emailFromQuery = params.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await forgetPassword({
      email,
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setMessage("Something went wrong. Please try again.");
    } else {
      setMessage("Check your email for the reset link.");
    }
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 ">
      <h1 className="text-xl font-bold">Forgot Password?</h1>
      <Input
        type="email"
        required
        value={email}
        placeholder="Your email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2"
      />
      <div className="grid w-full sm:grid-cols-2 gap-2">
        <Button type="submit">Request Reset</Button>
        <Link href="/login" className="text-sm text-foreground/80 text-center">
          Back to Sign In
        </Link>
      </div>
      {message && <p>{message}</p>}
    </form>
  );
}

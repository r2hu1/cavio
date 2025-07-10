"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    const { error } = await resetPassword({
      token,
      newPassword: password,
    });

    if (error) {
      setMessage("Failed to reset password.");
    } else {
      setMessage("Password reset! You can now sign in.");
      setTimeout(() => router.push("/auth/sign-in"), 3000);
    }
  };
  if (message == "Invalid or missing token.") {
    return (
      <div className="max-w-sm space-y-2 text-center">
        <AlertCircle className="h-10 w-10 mx-auto" />
        <h1 className="text-xl sm:text-3xl font-bold">Invalid Token</h1>
        <p className="text-base sm:text-lg sm:text-foreground/80">
          The link you followed may be expired or invalid. Please request a new
          password reset.
        </p>
        <Button asChild className="w-full mt-2">
          <Link href="/auth/sign-in">Back to Sign In</Link>
        </Button>
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto space-y-4 container"
    >
      <h1 className="text-xl font-bold">Reset Password</h1>
      {message && <p>{message}</p>}
      <Input
        type="password"
        placeholder="New password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2"
      />
      <Button type="submit">Reset Password</Button>
    </form>
  );
}

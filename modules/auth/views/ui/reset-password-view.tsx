"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, AlertTriangleIcon, Loader2 } from "lucide-react";
import SharedLogo from "@/components/shared-logo";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    const { error } = await resetPassword({
      token,
      newPassword: password,
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Success! You can now sign in.");
      setTimeout(() => router.push("/auth/sign-in"), 3000);
    }
  };
  if (message == "Invalid or missing token.") {
    return (
      <div className="max-w-sm grid gap-6 text-center">
        <SharedLogo />
        <Card className="gap-3">
          <CardHeader>
            <AlertTriangleIcon className="h-6 w-6 mx-auto" />
            <h1 className="text-xl sm:text-2xl font-bold">Invalid Token</h1>
          </CardHeader>
          <CardContent>
            <p className="text-base sm:text-lg text-foreground/80">
              The link you followed is invalid or has expired. Please request a
              new password reset email.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full mt-2">
              <Link href="/auth/forgot-password">Continue</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  return (
    <div className="max-w-sm grid gap-6 text-center w-full">
      <SharedLogo />
      <Card className="gap-3">
        <CardHeader>
          <h1 className="text-xl font-bold">Reset Password</h1>
          <p className="text-sm sm:text-base text-foreground/80">
            Create a secure password for your cavio account to continue using
            the platform.
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent>
            <Input
              type="password"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {message && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="grid sm:grid-cols-2 gap-2">
            <Button type="submit" disabled={loading} className="w-full">
              {!loading ? (
                "Change Password"
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </Button>
            <Button type="button" asChild variant="secondary">
              <Link href="/">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

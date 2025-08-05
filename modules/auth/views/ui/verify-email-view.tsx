"use client";
import SharedLogo from "@/components/shared-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function VerifyEmail() {
  return (
    <div className="max-w-sm space-y-6 text-center">
      <SharedLogo />
      <Card className="gap-3">
        <CardHeader>
          <CircleCheckBig className="h-6 w-6 mx-auto" />
          <h1 className="sm:text-2xl text-xl font-bold">Check Your Email</h1>
        </CardHeader>
        <CardContent>
          <p className="text-base sm:text-lg text-foreground/80">
            We have sent you an email with a verification link. Please check
            your inbox and click the link to verify your email address.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

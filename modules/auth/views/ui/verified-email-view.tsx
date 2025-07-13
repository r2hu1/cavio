"use client";
import SharedLogo from "@/components/shared-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertTriangleIcon,
  CircleCheckBig,
  GalleryVerticalEnd,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifiedEmail() {
  const params = useSearchParams();
  if (params.get("error")) {
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
              The link you followed is invalid or has expired. Please sign in
              again. to get a new link.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full mt-2">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-sm grid gap-6 text-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Cavio
        </a>
      </div>
      <Card className="gap-3">
        <CardHeader>
          <CircleCheckBig className="h-7 w-7 mx-auto" />
          <h1 className="text-xl sm:text-2xl font-bold">Email Verified</h1>
        </CardHeader>
        <CardContent>
          <p className="text-base sm:text-lg text-foreground/80">
            Your email has been verified. Sign in to your account to continue.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full mt-2">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

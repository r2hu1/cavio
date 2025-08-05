"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOut({
  className,
  text = "Log out",
  children,
  variant = "link",
  size = "default",
}: {
  className?: string;
  text?: string;
  children?: React.ReactNode;
  variant?: "link" | "outline" | "ghost" | "default" | "secondary";
  size?: "default" | "sm" | "lg";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch {
      router.refresh();
    } finally {
      router.push("/auth/sign-in");
    }
    setLoading(false);
  };
  return (
    <Button
      variant={variant}
      onClick={handleSignOut}
      className={cn("hover:no-underline", className)}
      disabled={loading}
      size={size}
    >
      {loading ? <Loader2 className="!h-3.5 !w-3.5 animate-spin" /> : children}
    </Button>
  );
}

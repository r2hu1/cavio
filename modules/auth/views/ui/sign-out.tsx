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
}: {
  className?: string;
  text?: string;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
    router.push("/");
  };
  return (
    <Button
      variant="link"
      onClick={handleSignOut}
      className={cn("hover:no-underline", className)}
      disabled={loading}
    >
      {loading ? <Loader2 className="!h-3.5 !w-3.5 animate-spin" /> : children}
    </Button>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SignOut({
  className,
  text = "Log out",
  children,
}: {
  className?: string;
  text?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };
  return (
    <Button
      variant="link"
      onClick={handleSignOut}
      className={cn("hover:no-underline", className)}
    >
      {children}
    </Button>
  );
}

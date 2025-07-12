"use client";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOut({
  className,
  text = "Log out",
}: {
  className?: string;
  text?: string;
}) {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };
  return (
    <p onClick={handleSignOut} className={className}>
      {text}
    </p>
  );
}

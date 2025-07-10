"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const user = useSession();
  return (
    <div className="grid gap-2">
      {user.data?.user.email}
      {user.data?.user.emailVerified}
      <Button
        onClick={async () => {
          await signOut();
          router.push("/auth/sign-in");
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}

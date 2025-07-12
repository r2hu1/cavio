"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { polarClient } from "@/lib/polar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const user = useSession();
  const [products, setProducts] = useState<any>([]);
  const prd = async () => {
    const proudc = await polarClient.products.list({
      isArchived: false,
      isRecurring: true,
      sorting: ["price_amount"],
    });
    setProducts(proudc.result.items);
  };
  useEffect(() => {
    prd();
  }, [user.data?.session]);
  return (
    <div className="grid gap-2">
      <Button
        onClick={async () => {
          await signOut();
          router.push("/auth/sign-in");
        }}
      >
        Sign Out
      </Button>
      <span>Products</span>
      <span>{products.length}</span>
    </div>
  );
}

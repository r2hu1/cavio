"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import SignUpForm from "@/modules/auth/views/ui/sign-up-view";

export default function SignUpPage() {
  const { isPending, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.user) {
      router.push("/dashboard");
    }
  }, [data?.session]);
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Cavio
        </a>
      </div>
      <SignUpForm />
    </div>
  );
}

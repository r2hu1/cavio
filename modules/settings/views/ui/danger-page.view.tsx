"use client";
import { Button } from "@/components/ui/button";
import SessionPageNav from "./settings-page-nav";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Loader } from "@/components/ai-elements/loader";

export default function DangerPageView() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [sent, setSent] = useState(false);

  const initDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await authClient.deleteUser();
      if (!res.error) {
        toast.info("Check your email for confirmation");
        setSent(true);
      }
    } catch (error: any) {
      toast.error("Error", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <SessionPageNav active={"danger"} />
      <div className="mb-10 flex gap-2 items-center justify-between">
        <div>
          <h1 className="font-medium text-lg">Danger</h1>
          <p className="text-sm text-foreground/80">
            Delete, reset, and manage your account. Be careful!
          </p>
        </div>
      </div>
      <div className="grid gap-3 bg-sidebar p-3 rounded-md">
        <div className="grid gap-2">
          <h2 className="font-medium text-base">Delete Account</h2>
          <p className="text-sm text-foreground/80">
            Permanently delete your account and all associated data. This action
            cannot be undone.
            <br />
            <span className="text-xs">Required email confirmation*</span>
          </p>
        </div>
        <Button
          onClick={initDelete}
          variant="destructive"
          size="sm"
          disabled={sent || isDeleting}
          className="w-fit"
        >
          {isDeleting ? (
            <Loader className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          Continue
        </Button>
      </div>
    </div>
  );
}

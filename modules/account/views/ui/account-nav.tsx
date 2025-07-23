"use client";

import { ModeToggle } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import SignOut from "@/modules/auth/views/ui/sign-out";
import { LogOut } from "lucide-react";

export default function AccountNav() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-sm">Account & Settings</h1>
      <div className="flex items-center gap-2">
        <SignOut variant="default" size="sm">
          Logout <LogOut className="!h-3.5 !w-3.5" />
        </SignOut>
        <ModeToggle />
      </div>
    </div>
  );
}

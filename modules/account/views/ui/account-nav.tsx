"use client";

import { ModeToggle } from "@/components/theme-switcher";

export default function AccountNav() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-sm">Account & Settings</h1>
      <ModeToggle />
    </div>
  );
}

"use client";

import { useAuthState } from "@/modules/auth/providers/auth-context";
import { User } from "better-auth";
import { useEffect, useState } from "react";
import SessionPageNav from "./settings-page-nav";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignOut from "@/modules/auth/views/ui/sign-out";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SettingsPageView() {
  const { data, isPending } = useAuthState();

  return (
    <div>
      <SessionPageNav active={"account"} />
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-medium text-lg">Personal Info</h1>
          <p className="text-sm text-foreground/80">
            Manage your personal information
          </p>
        </div>
        <SignOut variant="default" size="sm">
          Logout <LogOut className="!h-3.5 !w-3.5" />
        </SignOut>
      </div>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img className="rounded-3xl h-20 w-20" src={data?.user?.image} />
            <div className="space-y-0.5">
              <h1 className="text-lg font-medium">{data?.user?.name}</h1>
              <h2 className="text-base -mt-1 text-foreground/80">
                {data?.user?.email}
              </h2>
              <Badge>
                {data?.user?.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
          <div>
            <h1 className="text-sm text-left">Joined On</h1>
            <p className="text-foreground/80 text-sm">
              {new Date(data?.user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="w-full hidden max-w-sm">
          <div className="flex items-center gap-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input defaultValue={data?.user?.name} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={data?.user?.email} />
            </div>
          </div>
          <Button className="w-full">Save</Button>
        </div>
      </div>
    </div>
  );
}

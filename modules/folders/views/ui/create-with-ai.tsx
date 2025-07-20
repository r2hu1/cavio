"use client";
import { AuroraText } from "@/components/ui/aurora-text";
import { BorderTrail } from "@/components/ui/border-trail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function CreateWithAI() {
  return (
    <div className="relative rounded-xl w-full">
      {/* <BorderTrail /> */}
      <Sparkles className="!h-4 !w-4 absolute left-4 top-1/2 -translate-y-1/2" />
      <Input
        id="prompt"
        className="pl-12 pr-14 h-12 rounded-xl"
        placeholder="Ask me anything, i will write it for you!"
      />
      <div className="flex absolute right-2 top-1/2 -translate-y-1/2 gap-2 justify-end items-center">
        <Button className="h-8 w-8">
          <ArrowUpRight className="!h-4 !w-4" />
        </Button>
      </div>
    </div>
  );
}

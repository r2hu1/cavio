"use client";

import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUpRight,
  Bolt,
  FilePlus,
  PencilLine,
  Sparkles,
} from "lucide-react";
import CreateWithAI from "./create-with-ai";

export default function FolderPageView() {
  return (
    <div>
      <CreateWithAI />
      <div className="flex items-center justify-between mt-10">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-medium">Folder Name</h1>
          <PencilLine className="!h-4 text-foreground/70 !w-4" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" className="text-xs">
            New File <FilePlus className="!h-3.5 !w-3.5" />
          </Button>
          <Button size="sm" className="w-8" variant="secondary">
            <Bolt className="!h-3.5 !w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

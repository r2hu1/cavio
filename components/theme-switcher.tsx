"use client";

import * as React from "react";
import { Contrast } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      onClick={() => {
        setTheme(resolvedTheme == "dark" ? "light" : "dark");
      }}
      size="icon"
      className="h-8 w-8"
    >
      <Contrast className="!h-3.5 !w-3.5" />
    </Button>
  );
}

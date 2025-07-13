"use client";

import * as React from "react";
import { Contrast, Moon, Sun, SunMoon, SunSnow } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      onClick={() => {
        setTheme(resolvedTheme == "dark" ? "light" : "dark");
      }}
      size="icon"
    >
      <Contrast className="h-4 w-4" />
    </Button>
  );
}

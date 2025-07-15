"use client";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export default function SearchFolderPopup({
  children,
  triggerClassName,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const actions: Array<{
    label: string;
    href?: string;
    onSelect?: () => void;
  }> = [
    {
      label: "Home",
      href: "/",
    },
  ];

  return (
    <div>
      <button
        className={`w-full outline-0 ${triggerClassName}`}
        onClick={() => setOpen((open) => !open)}
      >
        {children}
      </button>
      <CommandDialog
        className="bg-accent p-1"
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Search across folders, files, settings.">
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="px-2 bg-accent py-1 pt-2">
          <p className="text-xs text-foreground/80">
            Use arrows to navigate, press Enter to select. Press Escape to
            close.
          </p>
        </div>
      </CommandDialog>
    </div>
  );
}

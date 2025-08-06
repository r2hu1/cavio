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
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ArrowUpLeftFromSquareIcon,
  BoltIcon,
  FileText,
  FolderIcon,
  FolderPlusIcon,
  HomeIcon,
  IconNode,
  UserIcon,
} from "lucide-react";

export default function SearchPopup({
  children,
  triggerClassName,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const trpc = useTRPC();
  const {
    data: folders,
    isPending: isFoldersPending,
    error: foldersError,
  } = useQuery(trpc.folder.getAll.queryOptions());
  const {
    data: documents,
    isPending: isDocumentsPending,
    error: documentsError,
  } = useQuery(trpc.document.getAll.queryOptions());
  const {
    data: history,
    isPending: historyPending,
    error: historyError,
  } = useQuery(trpc.ai.history.queryOptions());

  const navigations: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
    onSelect?: () => void;
  }> = [
    {
      label: "Home",
      href: "/",
      icon: <HomeIcon className="!h-3.5 !w-3.5" />,
    },
    {
      label: "Accounts",
      href: "/account",
      icon: <UserIcon className="!h-3.5 !w-3.5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <BoltIcon className="!h-3.5 !w-3.5" />,
    },
  ];

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
    icon: React.ReactNode;
    onSelect?: () => void;
  }> = [
    {
      label: "New Folder",
      icon: <FolderPlusIcon className="!h-3.5 !w-3.5" />,
    },
  ];

  const handleOnSelect = (href: string) => {
    router.push(href);
    setOpen(false);
  };

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
          <CommandGroup heading="Folders">
            {!isFoldersPending &&
              folders &&
              folders.map((folder) => (
                <CommandItem
                  key={folder.id}
                  onSelect={() => handleOnSelect(`/folder/${folder.id}`)}
                  className="flex items-center"
                >
                  <FolderIcon className="!h-3.5 !w-3.5" />
                  {folder.title}
                  <span className="text-xs ml-auto text-foreground/60">
                    {folder?.updatedAt
                      ? new Date(folder.updatedAt).toLocaleTimeString()
                      : ""}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Documents">
            {!isDocumentsPending &&
              documents &&
              documents.map((document) => (
                <CommandItem
                  key={document.id}
                  onSelect={() =>
                    handleOnSelect(
                      `/folder/${document.folderId}/${document.id}`,
                    )
                  }
                  className="flex items-center"
                >
                  <FileText className="!h-3.5 !w-3.5" />
                  {document.title}
                  <span className="text-xs ml-auto text-foreground/60">
                    {document?.updatedAt
                      ? new Date(document.updatedAt).toLocaleTimeString()
                      : ""}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandGroup heading="Quick Links">
            {navigations.map((navigation) => (
              <CommandItem
                key={navigation.label}
                onSelect={() => handleOnSelect(navigation.href)}
                className="flex items-center"
              >
                {navigation.icon}
                {navigation.label}
                <ArrowUpLeftFromSquareIcon className="ml-auto !h-3.5 !w-3.5" />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="AI Chats">
            {!historyPending &&
              history &&
              history.map((item, index) => (
                <CommandItem
                  onSelect={() => handleOnSelect(`/chat/${item.id}`)}
                  key={index}
                >
                  {item.title}
                </CommandItem>
              ))}
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

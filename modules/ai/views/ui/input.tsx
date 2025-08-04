"use client";

import { useEffect, useRef, useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  ImageIcon,
  FileUp,
  Figma,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  PlusIcon,
  PenBox,
  Code,
  Dot,
  LayoutTemplate,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingModal from "@/modules/pricing/views/ui/pricing-modal";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

const templates = [
  {
    name: "Blog",
    content: "A blog post on ",
    icon: <ImageIcon className="!w-4 !h-4" />,
  },
  {
    name: "Letter",
    content: "A letter to ",
    icon: <FileUp className="!w-4 !h-4" />,
  },
  {
    name: "Research",
    content: "A research paper on ",
    icon: <FileText className="!w-4 !h-4" />,
  },
  {
    name: "Journal",
    content: "An journal entry on ",
    icon: <MonitorIcon className="!w-4 !h-4" />,
  },
  {
    name: "News",
    content: "An news article on ",
    icon: <CircleUserRound className="!w-4 !h-4" />,
  },
];

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;

      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY),
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight],
  );

  useEffect(() => {
    // Set initial height
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  // Adjust height on window resize
  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export default function ChatInput({
  content = "",
  type = "chat",
}: {
  content?: string;
  type?: string;
}) {
  const [value, setValue] = useState(content);
  const [mode, setMode] = useState(type);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        router.push(`/chat?content=${value}&type=${mode}`);
      }
    }
  };

  const handleClick = () => {
    if (value.trim()) {
      router.push(`/chat?content=${value}&type=${mode}`);
    }
  };

  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.premium.getCurrentSubscription.queryOptions(),
  );

  return (
    <div className="w-full">
      <div className="relative bg-background shadow-xl dark:shadow-none shadow-foreground/5 dark:bg-neutral-900 rounded-xl border border-input/50 dark:border-neutral-800">
        <div className="overflow-y-auto">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Write a film script with..."
            className="w-full px-4 py-3 resize-none bg-transparent border-none dark:text-white text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-neutral-500 placeholder:text-sm min-h-[70px]"
            style={{
              overflow: "hidden",
            }}
          />
        </div>

        <div className="flex items-center justify-between p-2 pt-0 overflow-hidden rounded-b-xl">
          <div className="flex gap-1 px-1 items-center">
            <Button
              variant={mode === "chat" ? "default" : "secondary"}
              onClick={() => {
                setMode("chat");
                handleClick();
              }}
              size="sm"
              className="cursor-pointer text-xs h-6 shadow-none"
            >
              Chat
            </Button>
            {!isPending && data ? (
              <Button
                variant={mode === "build" ? "default" : "secondary"}
                onClick={() => {
                  setMode("build");
                  handleClick();
                }}
                size="sm"
                className="cursor-pointer h-6 text-xs shadow-none"
              >
                Build
              </Button>
            ) : (
              <PricingModal>
                <Button
                  variant={"secondary"}
                  size="sm"
                  className="cursor-pointer h-6 text-xs shadow-none"
                  disabled={isPending}
                >
                  Build
                </Button>
              </PricingModal>
            )}
            {!isPending && data ? (
              <Button
                variant={mode === "research" ? "default" : "secondary"}
                onClick={() => {
                  setMode("research");
                  handleClick();
                }}
                size="sm"
                className="cursor-pointer h-6 text-xs shadow-none"
              >
                Research
              </Button>
            ) : (
              <PricingModal>
                <Button
                  variant={"secondary"}
                  size="sm"
                  className="cursor-pointer h-6 text-xs shadow-none"
                  disabled={isPending}
                >
                  Research
                </Button>
              </PricingModal>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-8 w-8"
              variant={value.trim() ? "default" : "secondary"}
            >
              <ArrowUpIcon className="!h-4 !w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* <div className="mt-20 space-y-7 !-mb-7">
        <h1 className="text-sm flex items-center gap-2 text-foreground/80">
          <LayoutTemplate className="!h-3.5 !w-3.5" /> Templates.
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="space-y-1 cursor-pointer bg-sidebar border hover:border-input transition rounded-lg p-2">
            <ImageIcon className="!w-6 !h-6 text-foreground/60" />
            <h1 className="text-sm font-medium">Creative Blog</h1>
            <p className="text-sm text-foreground/80">
              Create a blog post with a creative and engaging content.
            </p>
          </div>
        </div>
      </div> */}
      {/* <div className="flex items-center justify-center flex-wrap gap-3 mt-8 -mb-4">
        {templates.map((template) => (
          <ActionButton
            key={template.name}
            icon={template.icon}
            label={template.name}
            onClick={() => {
              setValue(template.content);
            }}
          />
        ))}
      </div> */}
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <Button
      variant="outline"
      className="!px-4 rounded-full"
      size="sm"
      onClick={onClick}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}

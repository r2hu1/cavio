"use client";

import { useEffect, useRef, useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

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

export default function ChatInput() {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState("chat");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        setValue("");
        adjustHeight(true);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="relative bg-secondary dark:bg-neutral-900 rounded-xl border dark:border-neutral-800">
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
            className={cn(
              "w-full px-4 py-3",
              "resize-none",
              "bg-transparent",
              "border-none",
              "dark:text-white text-sm",
              "focus:outline-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-neutral-500 placeholder:text-sm",
              "min-h-[80px]",
            )}
            style={{
              overflow: "hidden",
            }}
          />
        </div>

        <div className="flex items-center justify-between p-2 overflow-hidden rounded-b-xl bg-background border-t">
          <div className="flex items-center">
            <Button
              variant={mode === "chat" ? "secondary" : "outline"}
              onClick={() => setMode("chat")}
              size="sm"
              className="rounded-r-none border shadow-none border-r-0"
            >
              {mode === "chat" && (
                <Dot className="text-indigo-600 !h-6 !w-6 -ml-2 -mr-2" />
              )}
              Chat
            </Button>
            <Button
              variant={mode === "build" ? "secondary" : "outline"}
              onClick={() => setMode("build")}
              size="sm"
              className="rounded-l-none border shadow-none border-l-0"
            >
              {mode === "build" && (
                <Dot className="text-indigo-600 !h-6 !w-6 -ml-2 -mr-2" />
              )}
              Build
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-8 border"
              variant={value.trim() ? "default" : "outline"}
            >
              <span>Send</span>
              <ArrowUpIcon className="!h-4 !w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-3 mt-4">
        <ActionButton icon={<ImageIcon className="w-4 h-4" />} label="Blog" />
        <ActionButton icon={<PenBox className="w-4 h-4" />} label="Letter" />
        <ActionButton icon={<FileUp className="w-4 h-4" />} label="Homework" />
        <ActionButton icon={<Code className="w-4 h-4" />} label="Script" />
        <ActionButton
          icon={<CircleUserRound className="w-4 h-4" />}
          label="Journal"
        />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-full border dark:text-white cursor-pointer transition-colors"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

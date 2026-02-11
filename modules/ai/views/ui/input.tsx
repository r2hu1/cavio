"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  ImageIcon,
  FileUp,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import useAutoResizeTextarea from "@/hooks/use-auto-resize-textarea";
import { useAiChatInputState } from "../providers/input-provider";

export const templates = [
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

export default function ChatInput({
  content = "",
  type = "chat",
}: {
  content?: string;
  type?: "chat" | "build" | "research";
}) {
  const [value, setValue] = useState(content);
  const [mode, setMode] = useState<"chat" | "build" | "research">("chat");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const router = useRouter();

  const {
    setValue: setStateValue,
    setMode: setStateMode,
    setSubmitted,
  } = useAiChatInputState();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        setStateValue(value);
        setStateMode(mode);
        setSubmitted(true);
        setValue("");
        router.push(`/chat`);
      }
    }
  };

  const pathname = usePathname();
  const handleClick = () => {
    if (pathname != "/") return;
    if (value.trim()) {
      setStateValue(value);
      setStateMode(mode);
      setSubmitted(true);
      setValue("");
      router.push(`/chat`);
    }
  };

  const placeHolder = {
    chat: "Hey what is meant by ...",
    build: "Write a film script with...",
    research: "Do a research on rise of minecraft",
  };

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
            placeholder={placeHolder[mode]}
            className="w-full px-4 py-3 mb-2 resize-none bg-transparent border-none dark:text-white text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-neutral-500 placeholder:text-sm min-h-[70px]"
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
              }}
              size="sm"
              className="cursor-pointer text-xs h-6 shadow-none"
            >
              Chat
            </Button>
            <Button
              variant={mode === "build" ? "default" : "secondary"}
              onClick={() => {
                setMode("build");
              }}
              size="sm"
              className="cursor-pointer h-6 text-xs shadow-none"
            >
              Build
            </Button>
            <Button
              variant={mode === "research" ? "default" : "secondary"}
              onClick={() => {
                setMode("research");
              }}
              size="sm"
              className="cursor-pointer h-6 text-xs shadow-none"
            >
              Research
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="h-8 w-8"
              variant={value.trim() ? "default" : "secondary"}
              onClick={handleClick}
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

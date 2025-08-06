"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import ChatInput from "./input";
import { Textarea } from "@/components/ui/textarea";
import StaticInput from "./static-input";
import { useAiChatInputState } from "../providers/input-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { UserChatBlock } from "./user-chat-block";
import {
  Brain,
  BrainCircuit,
  Copy,
  Download,
  FileText,
  Loader2,
  PencilLine,
} from "lucide-react";
import Tooltip from "@/components/ui/tooltip-v2";
import { Button } from "@/components/ui/button";
import { db } from "@/db/client";
import { aiChatHistory } from "@/db/schema";
import { isAuthenticated } from "@/lib/cache/auth";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Skeleton } from "@/components/ui/skeleton";

const thinkingTexts = ["Thinking", "Researching", "Organizing", "Summarizing"];

export default function IdChatPageView({ params }: { params: string }) {
  const router = useRouter();

  const {
    value: stateValue,
    mode: stateMode,
    setValue: stateSetValue,
    setMode: setStateMode,
    setPending: setStatePending,
  } = useAiChatInputState();

  const trpc = useTRPC();
  const {
    data: historyData,
    isPending: historyPending,
    error: historyError,
  } = useQuery(trpc.ai.getExisting.queryOptions({ chatId: params }));
  const { mutate, data, error, isPending } = useMutation(
    trpc.ai.create.mutationOptions({}),
  );

  const [history, setHistory] = useState<{ role: string; content: string }[]>([
    {
      role: "ai",
      content: "",
    },
    {
      role: "user",
      content: "",
    },
  ]);

  const handleReq = async () => {
    if (!stateValue) return;
    if (isPending) return;
    setStatePending(true);
    setHistory((prev) => [...prev, { role: "user", content: stateValue }]);
    stateSetValue("");
    mutate(
      {
        content: stateValue,
        typeOfModel: stateMode,
        chatId: params,
      },
      {
        onError: (error) => {
          toast.error(error.message);
        },
        onSuccess: async (data) => {
          setHistory((prev) => [
            ...prev,
            { role: "ai", content: data.text as string },
          ]);
          if (data?.id) {
            router.push(`/chat/${data.id}`);
          }
        },
        onSettled: () => {
          setStatePending(false);
        },
      },
    );
  };

  useEffect(() => {
    if (historyPending || historyError || isPending) return;
    if (!stateValue.trim()) return;
    handleReq();
    stateSetValue("");
  }, [stateValue]);

  useEffect(() => {
    if (historyData) {
      setHistory([...(historyData?.content as any)]);
    }
  }, [historyPending]);

  const [aiThinkingIndex, setAiThinkingIndex] = useState(0);

  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => {
      setAiThinkingIndex((prev) => (prev + 1) % thinkingTexts.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPending]);

  return (
    <div className="max-w-3xl mx-auto pb-56">
      {isPending && !history && (
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="flex flex-col items-end justify-end gap-2">
            <Skeleton className="h-20 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-32 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex flex-col items-end justify-end gap-2">
            <Skeleton className="h-20 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-10">
        {history.map((item, index) => {
          if (!item.content) return null;
          if (item.role === "ai") {
            return (
              <div
                key={index}
                className="prose prose-sm max-w-none dark:prose-invert
                  prose-headings:text-foreground
                  prose-p:text-foreground/90
                  prose-p:sm:text-base
                  prose-blockquote:text-muted-foreground prose-blockquote:border-l-muted
                  prose-code:text-foreground prose-code:bg-muted prose-code:before:hidden prose-code:after:hidden
                  prose-a:text-primary hover:prose-a:text-primary/80
                  prose-hr:border-border
                  prose-img:rounded-md
                  prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-md prose-pre:p-4 prose-pre:overflow-x-auto
                  prose-table:text-foreground prose-th:border-border prose-td:border-border
                  relative
                  group
                "
              >
                <MarkdownContent
                  className="max-w-lg"
                  content={
                    item.content
                      .replace(/^```mdx\s*\r?\n/, "")
                      .replace(/```$/, "") as string
                  }
                  id={String(index)}
                />
                <div className="flex gap-2.5 mt-4 items-center justify-start">
                  <Tooltip text="Save as file">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Download className="!h-3.5 !w-3.5" />
                    </Button>
                  </Tooltip>
                  <Tooltip text="Copy Response">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Copy className="!h-3.5 !w-35" />
                    </Button>
                  </Tooltip>
                  <Button size="sm" variant="ghost">
                    Export
                    <FileText className="!h-3.5 !w-3.5" />
                  </Button>
                </div>
              </div>
            );
          }

          return <UserChatBlock key={index} text={item.content as string} />;
        })}
        {isPending && (
          <div className="flex items-center gap-2 animate-pulse">
            <Brain className="!h-3.5 !w-3.5" />
            <p className="text-sm text-foreground/80">
              {thinkingTexts[aiThinkingIndex]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

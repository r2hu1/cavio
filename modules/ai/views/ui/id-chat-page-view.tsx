"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatInput from "./input";
import StaticInput from "./static-input";
import { useAiChatInputState } from "../providers/input-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { UserChatBlock } from "./user-chat-block";
import {
  Brain,
  Copy,
  Download,
  FileText,
} from "lucide-react";
import Tooltip from "@/components/ui/tooltip-v2";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const thinkingTexts = ["Thinking", "Researching", "Organizing", "Summarizing"];

export default function IdChatPageView({ params }: { params: string }) {
  const router = useRouter();
  const trpc = useTRPC();

  const {
    value: stateValue,
    mode: stateMode,
    setValue: stateSetValue,
    setMode: setStateMode,
    setPending: setStatePending,
    setSubmitted,
    submitted,
  } = useAiChatInputState();

  const {
    data: historyData,
    isPending: historyPending,
    error: historyError,
  } = useQuery(trpc.ai.getExisting.queryOptions({ chatId: params }));

  const { mutate, isPending, data: aiResponse } = useMutation(
    trpc.ai.create.mutationOptions({})
  );

  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    []
  );

  const [aiThinkingIndex, setAiThinkingIndex] = useState(0);

  const handleReq = () => {
    if (!stateValue || isPending) return;
    setStatePending(true);

    const newHistory = [...history, { role: "user", content: stateValue }];
    setHistory(newHistory);

    mutate(
      {
        content: stateValue,
        typeOfModel: stateMode,
        chatId: params,
      },
      {
        onSuccess: (data) => {
          setHistory((prev) => [
            ...prev,
            { role: "ai", content: data.text as string },
          ]);
          if (data?.id) router.push(`/chat/${data.id}`);
        },
        onError: (error) => toast.error(error.message),
        onSettled: () => setStatePending(false),
      }
    );
  };

  useEffect(() => {
    if (historyData && !historyPending && !historyError) {
      setHistory(historyData.content as any);
    }
  }, [historyData, historyPending, historyError]);

  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => {
      setAiThinkingIndex((prev) => (prev + 1) % thinkingTexts.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPending]);

  useEffect(() => {
    if (stateValue && submitted && !isPending && !historyPending) {
      handleReq();
      setSubmitted(false);
    }
  }, [stateValue, submitted, isPending, historyPending]);

  const handleSave = (content:string)=>{
    try{
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${historyData?.title}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    catch{
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-56">
      {historyPending && (
        <div className="max-w-3xl mx-auto space-y-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-end justify-end gap-2">
              <Skeleton className="h-20 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-10">
        {history.map((item, index) => {
          if (!item.content) return null;

          if (item.role === "ai") {
            return (
              <div
                key={index}
                className="prose prose-sm max-w-none dark:prose-invert relative group"
              >
                <MarkdownContent
                  className="max-w-lg"
                  content={
                    item.content
                      .replace(/^```mdx\s*\r?\n/, "")
                      .replace(/```$/, "")
                  }
                  id={String(index)}
                />
                <div className="flex gap-2.5 mt-4 items-center justify-start">
                  <Tooltip text="Save as file">
                    <Button onClick={()=>handleSave(item.content.replace(/^```mdx\s*\r?\n/, "").replace(/```$/, ""))} size="icon" variant="ghost" className="h-8 w-8">
                      <Download className="!h-3.5 !w-3.5" />
                    </Button>
                  </Tooltip>
                  <Tooltip text="Copy Response">
                    <Button onClick={()=>{
                      navigator.clipboard.writeText(item.content.replace(/^```mdx\s*\r?\n/, "").replace(/```$/, ""))
                      toast.success("Copied to clipboard")
                    }} size="icon" variant="ghost" className="h-8 w-8">
                      <Copy className="!h-3.5 !w-3.5" />
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

          return <UserChatBlock key={index} text={item.content} />;
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

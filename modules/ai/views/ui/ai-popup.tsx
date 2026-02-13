"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, BotIcon, Loader2, Square } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import useAutoResizeTextarea from "@/hooks/use-auto-resize-textarea";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { thinkingTexts } from "./new-chat-page-view";

export default function AiPopup({
  insert,
  title,
  lastEdited,
}: {
  insert: any;
  title: string | undefined;
  lastEdited: string;
}) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 300,
  });

  const [value, setValue] = useState("");
  const [aiThinkingIndex, setAiThinkingIndex] = useState(0);

  const { sendMessage, messages, status, error, stop, resumeStream } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || isLoading) return;

    sendMessage({
      text: value,
      metadata: {
        document_title: title,
        document_last_edited: lastEdited,
      },
    });

    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setAiThinkingIndex((prev) => (prev + 1) % thinkingTexts.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  const renderedMessages = useMemo(() => {
    return messages.map((message) => {
      const text = message.parts
        ?.filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("");

      if (!text) return null;

      const clean = text.replace(/^```mdx\s*\r?\n/, "").replace(/```$/, "");

      return (
        <Message
          key={message.id}
          from={message.role === "assistant" ? "assistant" : "user"}
          className={
            message.role === "assistant"
              ? "prose prose-sm max-w-none dark:prose-invert"
              : undefined
          }
        >
          <MessageContent
            className={
              message.role === "assistant"
                ? "!bg-sidebar !text-sidebar-foreground"
                : "p-2.5 px-3.5"
            }
          >
            <MarkdownContent id={message.id} content={clean} />
          </MessageContent>
        </Message>
      );
    });
  }, [messages]);

  return (
    <Sheet>
      <SheetTrigger className="fixed bottom-7 right-7" asChild>
        <Button className="rounded-full h-10 w-10" size="icon">
          <BotIcon className="!h-4.5 !w-4.5" />
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:!min-w-[500px] !min-w-full">
        <SheetHeader>
          <SheetTitle>Cavio AI</SheetTitle>
        </SheetHeader>

        <Conversation className="max-h-[calc(100%-180px)] -mt-4">
          <ConversationContent>
            {renderedMessages}

            {isLoading && (
              <Message from="assistant">
                <MessageContent className="!bg-transparent">
                  <p className="text-sm animate-pulse text-foreground/80">
                    {thinkingTexts[aiThinkingIndex]}...
                  </p>
                </MessageContent>
              </Message>
            )}

            <ConversationScrollButton />
          </ConversationContent>
        </Conversation>

        <form
          onSubmit={handleSubmit}
          className="absolute bottom-4 left-0 right-0 w-full px-4"
        >
          <div className="relative pb-2 bg-sidebar dark:bg-card border rounded-xl">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Start typing here... & press enter!"
              className="w-full px-4 py-3 resize-none bg-transparent! border-0! shadow-none! text-sm focus:outline-none focus-visible:ring-0"
            />

            <div className="px-2 flex justify-end gap-2">
              {isLoading ? (
                <Button
                  type="button"
                  size="icon"
                  onClick={stop}
                  className="h-8 w-8"
                >
                  <Square className="!h-3.5 !w-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="icon"
                  className="h-8 w-8"
                >
                  <ArrowUp className="!h-3.5 !w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

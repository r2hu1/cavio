"use client";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, BotIcon, Copy, Loader2 } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Loader } from "@/components/ai-elements/loader";
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
  const { sendMessage, messages, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),
  });

  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    [],
  );

  const mutateFn = () => {
    console.log(
      history[history.length - 1]?.role == "ai" &&
        history[history.length - 1]?.content.slice(-300),
    );
    sendMessage({
      text: value,
    });
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (value.trim()) {
        setHistory((prev) => [...prev, { role: "user", content: value }]);
        mutateFn();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim()) {
      setHistory((prev) => [...prev, { role: "user", content: value }]);
      mutateFn();
    }
  };

  const [aiThinkingIndex, setAiThinkingIndex] = useState(0);

  useEffect(() => {
    if (status !== "streaming" && status !== "submitted") return;
    const interval = setInterval(() => {
      setAiThinkingIndex((prev) => (prev + 1) % thinkingTexts.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    toast.error(error?.message);
  }, [error]);
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
          <SheetDescription>Ask me anything you want!</SheetDescription>
        </SheetHeader>
        <Conversation className="max-h-[calc(100%-220px)] -mt-4">
          <ConversationContent>
            {messages.map((message) => {
              const text = message.parts
                ?.filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");

              if (!text) return null;

              if (message.role === "assistant") {
                return (
                  <Message
                    className="prose prose-sm max-w-none dark:prose-invert
                  prose-headings:text-foreground
                  prose-headings:text-lg
                  prose-p:text-foreground/90
                  prose-p:sm:text-base
                  prose-blockquote:text-muted-foreground prose-blockquote:border-l-muted
                  prose-code:text-foreground prose-code:bg-muted prose-code:before:hidden prose-code:after:hidden
                  prose-a:text-primary hover:prose-a:text-primary/80
                  prose-hr:border-border
                  prose-img:rounded-md
                  prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-md prose-pre:p-4 prose-pre:overflow-x-auto
                  prose-table:text-foreground prose-th:border-border prose-td:border-border
                "
                    key={message.id}
                    from="assistant"
                  >
                    <MessageContent className="!bg-sidebar !text-sidebar-foreground">
                      <MarkdownContent
                        id={message.id}
                        content={text
                          .replace(/^```mdx\s*\r?\n/, "")
                          .replace(/```$/, "")}
                      />
                    </MessageContent>
                  </Message>
                );
              }

              return (
                <Message key={message.id} from="user">
                  <MessageContent className="p-2.5 px-3.5">
                    <MarkdownContent
                      id={message.id}
                      content={text
                        .replace(/^```mdx\s*\r?\n/, "")
                        .replace(/```$/, "")}
                    />
                  </MessageContent>
                </Message>
              );
            })}

            {status == "streaming" ||
              (status == "submitted" && (
                <Message from="assistant">
                  <MessageContent className="!bg-transparent">
                    <p className="text-sm animate-pulse text-foreground/80">
                      {thinkingTexts[aiThinkingIndex]}...
                    </p>
                  </MessageContent>
                </Message>
              ))}
            <ConversationScrollButton />
          </ConversationContent>
        </Conversation>
        <form
          onSubmit={handleSubmit}
          className="absolute bottom-4 left-0 right-0 w-full px-4"
        >
          <div className="relative pb-2 bg-sidebar dark:bg-card border rounded-xl">
            <Textarea
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
              ref={textareaRef}
              onKeyDown={handleKeyDown}
              placeholder="Start typing here... & press enter!"
              className="w-full px-4 py-3 resize-none bg-transparent! border-none dark:text-white text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-neutral-500 placeholder:text-sm min-h-[70px]"
            ></Textarea>
            <div className="px-2 justify-end flex">
              <Button
                type="submit"
                disabled={status == "streaming" || status == "submitted"}
                size="icon"
                className="h-8 w-8"
              >
                <ArrowUp className="!h-3.5 !w-3.5" />
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

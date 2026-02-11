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
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { StreamedMessage } from "./streamed-message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Loader } from "@/components/ai-elements/loader";

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
  const trpc = useTRPC();
  const { mutate, isPending } = useMutation(
    trpc.ai.documentAiChatCreate.mutationOptions(),
  );

  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    [],
  );

  const mutateFn = () => {
    console.log(
      history[history.length - 1]?.role == "ai" &&
        history[history.length - 1]?.content.slice(-300),
    );
    mutate(
      {
        content: value,
        title: title || "",
        lastEditedDocContent: lastEdited.toString(),
        previous:
          (history[history.length - 1]?.role == "ai" &&
            history[history.length - 1]?.content.slice(-300)) ||
          "N/A",
      },
      {
        onSuccess: (data) => {
          setValue("");
          setHistory((prev) => [...prev, { role: "ai", content: data.text }]);
          // insert(data);
        },
        onError: (data) => {
          toast.error(data.message);
        },
      },
    );
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
            {history.map((item, index) => {
              if (!item.content) return null;
              if (item.role === "ai") {
                return (
                  <Message from="assistant">
                    <MessageContent className="!bg-sidebar !text-sidebar-foreground">
                      <StreamedMessage
                        key={index}
                        index={index}
                        content={item.content}
                      />
                    </MessageContent>
                  </Message>
                );
              }
              return (
                <Message from="user">
                  <MessageContent className="p-2.5 px-3.5">
                    {item.content}
                  </MessageContent>
                </Message>
              );
            })}
            {isPending && (
              <Message from="assistant">
                <MessageContent className="!bg-transparent">
                  <Loader className="h-3.5 w-3.5 animate-spin" />
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
                disabled={isPending}
                size="icon"
                className="h-8 w-8"
              >
                {isPending ? (
                  <Loader2 className="!h-3.5 !w-3.5 animate-spin" />
                ) : (
                  <ArrowUp className="!h-3.5 !w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

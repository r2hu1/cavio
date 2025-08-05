"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import ChatInput from "./input";
import { Textarea } from "@/components/ui/textarea";
import StaticInput from "./static-input";
import { useAiChatInputState } from "../providers/input-provider";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { MarkdownContent } from "@/components/ui/markdown-content";

export default function NewChatPageView() {
  const router = useRouter();
  const params = useSearchParams();

  const [content, setContent] = useState<string>("");
  const [type, setType] = useState<string>("");

  useEffect(() => {
    const contentParam = params.get("content");
    const typeParam = params.get("type");
    if (contentParam) setContent(contentParam);
    if (typeParam) setType(typeParam);
    if (params.toString()) {
      router.replace(window.location.pathname);
    }
  }, []);

  const {
    value: stateValue,
    mode: stateMode,
    setValue: stateSetValue,
    setMode: setStateMode,
    setPending: setStatePending,
  } = useAiChatInputState();

  const trpc = useTRPC();
  const { mutate, data, error, isPending } = useMutation(
    trpc.ai.create.mutationOptions({}),
  );

  const [history, setHistory] = useState<{ user?: string; ai?: string }[]>([
    {},
  ]);

  useEffect(() => {
    setStatePending(true);
    mutate(
      {
        content: stateValue,
        typeOfModel: stateMode,
      },
      {
        onError: (error) => {
          toast.error(error.message);
        },
        onSuccess: (data) => {
          console.log(data);
          history.push({ user: stateValue, ai: data });
        },
        onSettled: () => {
          setStatePending(false);
        },
      },
    );
  }, [stateValue]);

  return (
    <div className="max-w-6xl mx-auto pb-60">
      <div className="flex flex-col gap-10">
        {history.map((item, index) => (
          <Fragment key={index}>
            <UserBlock text={item.user as string} />
            <div className="">
              <MarkdownContent
                className="max-w-lg"
                content={item.ai as string}
                id={String(index)}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const UserBlock = ({ text }: { text: string }) => (
  <div className="flex justify-end">
    <div className="p-3 bg-sidebar clear-both float-start dark:bg-card border rounded-xl text-sm max-w-sm">
      {text}
    </div>
  </div>
);

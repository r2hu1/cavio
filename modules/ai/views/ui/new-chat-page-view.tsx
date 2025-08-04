"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatInput from "./input";
import { Textarea } from "@/components/ui/textarea";

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

  return (
    <div className="h-svh">
      <div>
        <h1>{content} </h1>
        <h1>{type} </h1>
      </div>
      <div className="sticky bottom-0 w-full flex items-center justify-center">
        <div className="w-full px-20">
          <ChatInput content={content} type={type} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatInput from "./input";

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
    <div className="relative">
      <div>
        <h1>{content} </h1>
        <h1>{type} </h1>
      </div>
      <div className="absolute bottom-0 left-0 w-full flex items-center justify-center">
        <div className="mb-10 w-full max-w-5xl">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}

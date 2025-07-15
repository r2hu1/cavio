import { BorderTrail } from "@/components/ui/border-trail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CornerDownLeft } from "lucide-react";
import { useState } from "react";

export default function ChatInput() {
  const demos = [
    {
      title: "Write a blog on increasing AI adoption",
      prompt: "Write a blog on increasing AI adoption",
    },
    {
      title: "Write a article on rising trends in technology",
      prompt: "Write a article on rising trends in technology",
    },
    {
      title: "Write a blog on the future of ecommerce",
      prompt: "Write a blog on the future of ecommerce",
    },
    {
      title: "Write a tv commercial script for shampoo brand",
      prompt: "Write a tv commercial script for shampoo brand",
    },
  ];

  const [prompt, setPrompt] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    setPrompt(e.target.value);
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: send prompt to server
  };

  return (
    <div>
      <form onSubmit={handleSend} className="relative rounded-md">
        {/* <BorderTrail size={100} /> */}
        <Textarea
          id="prompt"
          name="prompt"
          placeholder="Write a blog on current trends in..."
          className="resize-none hidden_scrollbar max-h-[400px] min-h-[100px] pb-10"
          onChange={handleInput}
          onInput={handleInput}
        ></Textarea>
        <div className="flex items-center gap-1 absolute right-0 px-2 bottom-2">
          <Button size="icon" className=" h-8 w-8">
            <CornerDownLeft className="!h-3.5 !w-3.5" />
          </Button>
        </div>
      </form>
      <div className="mt-8">
        <p className="text-foreground/80 text-xs text-center">
          — or try one of these —
        </p>
        <div className="grid mt-4 sm:grid-cols-2 gap-3">
          {demos.map((demo) => (
            <Button
              key={demo.title}
              variant="outline"
              className="sm:!text-nowrap !text-wrap rounded-full"
            >
              {demo.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

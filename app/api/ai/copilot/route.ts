import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext } from "@/trpc/init";
import { googleai } from "@/lib/google-ai";
import { getApiKey } from "@/modules/ai/views/creds/lib";

export async function POST(req: Request) {
  const { prompt: messages } = await req.json();
  if (!messages || messages.length === 0) {
    return NextResponse.json({ status: 200 });
  }
  const key = await getApiKey();
  if (!key) {
    return NextResponse.json(
      {
        text: "No API key found, please set it in the settings.",
      },
      { status: 200 },
    );
  }

  const completion = await generateText({
    model: googleai("models/gemini-2.0-flash") as any,
    prompt: messages,
    system: `You are an advanced AI writing assistant, similar to VSCode Copilot but for general text. Your task is to predict and generate the next part of the text based on the given context.

    Rules:
      - Continue the text naturally up to the next punctuation mark (., ,, ;, :, ?," " or !).
      - Maintain style and tone. Don't repeat given text.
      - For unclear context, provide the most likely continuation.
      - Handle code snippets, lists, or structured text if needed.
      - Don't include """ in your response.
      - CRITICAL: Always end with a punctuation mark.
      - CRITICAL: Avoid starting a new block. Do not use block formatting like >, #, 1., 2., -, etc. The suggestion should continue in the same block as the context.
      - If no context is provided or you can't generate a continuation, return "" without explanation.
      - CRITICAL: Don't return any information about yourself or your capabilities.
      `,
  });

  // console.log(completion);
  return NextResponse.json(
    {
      text: completion.text,
    },
    { status: 200 },
  );
}

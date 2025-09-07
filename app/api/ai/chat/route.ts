import { streamText } from "ai";
import { NextResponse } from "next/server";
import { googleai } from "@/lib/google-ai";
import { SYSTEM_PROMPT } from "@/modules/ai/constants";

export async function POST(req: Request) {
  const { prompt: messages } = await req.json();
  if (!messages || messages.length === 0) {
    return NextResponse.json({ status: 200 });
  }

  const completion = streamText({
    model: googleai("models/gemini-2.0-flash") as any,
    prompt: messages,
    system: SYSTEM_PROMPT,
  });

  return completion.toUIMessageStreamResponse();
}

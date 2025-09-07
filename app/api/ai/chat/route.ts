import { streamText } from "ai";
import { NextResponse } from "next/server";
import { googleai } from "@/lib/google-ai";
import { SYSTEM_PROMPT } from "@/modules/ai/constants";
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

  const completion = streamText({
    model: googleai("models/gemini-2.0-flash") as any,
    prompt: messages,
    system: SYSTEM_PROMPT,
  });

  return completion.toUIMessageStreamResponse();
}

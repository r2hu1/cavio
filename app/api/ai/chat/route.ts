import { streamText } from "ai";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/modules/ai/constants";
import { getApiKey } from "@/modules/ai/views/creds/lib";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { prompt: messages } = await req.json();
  if (!messages || messages.length === 0) {
    return NextResponse.json({ status: 200 });
  }
  const key = await getApiKey();
  if (!key) {
    return NextResponse.json(
      {
        text: "No API key found, please set it in the ![settings](/settings/preferences).",
      },
      { status: 200 },
    );
  }

  const googleai = createGoogleGenerativeAI({
    apiKey: key || "",
  });

  const completion = streamText({
    model: googleai("models/gemini-2.0-flash") as any,
    prompt: messages,
    system: SYSTEM_PROMPT,
  });

  return completion.toUIMessageStreamResponse();
}

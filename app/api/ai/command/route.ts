import type { NextRequest } from "next/server";
import { generateText, streamText } from "ai";
import { NextResponse } from "next/server";
import { googleai } from "@/lib/google-ai";
import { getApiKey } from "@/modules/ai/views/creds/lib";

export async function POST(req: NextRequest) {
  const { messages, system } = await req.json();
  const key = await getApiKey();
  if (!key) {
    return NextResponse.json(
      { error: "Please provide a valid API key in the settings!" },
      { status: 500 },
    );
  }

  try {
    const result = await streamText({
      model: googleai("models/gemini-2.0-flash") as any,
      prompt: messages[0].content,
      system,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}

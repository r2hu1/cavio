import type { NextRequest } from "next/server";
import { generateText, streamText } from "ai";
import { NextResponse } from "next/server";
import { getApiKey } from "@/modules/ai/views/creds/lib";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  const { messages, system } = await req.json();
  const key = await getApiKey();
  if (!key) {
    return NextResponse.json(
      {
        error:
          "No API key found, please set it in the [settings](/settings/preferences).",
      },
      { status: 500 },
    );
  }

  try {
    const googleai = createGoogleGenerativeAI({
      apiKey: key || "",
    });
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

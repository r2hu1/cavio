import type { NextRequest } from "next/server";

import { createGateway, generateText } from "ai";
import { NextResponse } from "next/server";
import { getApiKey } from "@/modules/ai/views/creds/lib";

export async function POST(req: NextRequest) {
  const { prompt, system } = await req.json();

  const apiKey = await getApiKey();

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ai gateway API key." },
      { status: 401 },
    );
  }

  const gatewayProvider = createGateway({
    apiKey,
  });

  try {
    const result = await generateText({
      abortSignal: req.signal,
      maxOutputTokens: 50,
      model: gatewayProvider(`google/gemini-2.5-flash`),
      prompt,
      system,
      temperature: 0.7,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}

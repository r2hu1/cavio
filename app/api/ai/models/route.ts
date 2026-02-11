import { NextResponse } from "next/server";
import { getApiKey } from "@/modules/ai/views/creds/lib";

export async function GET() {
  const apiKey = await getApiKey();
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key found" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter to only include Gemini models and format them
    const models = data.models
      ?.filter((model: any) => 
        model.name.startsWith("models/gemini") && 
        model.supportedGenerationMethods?.includes("generateContent")
      )
      ?.map((model: any) => {
        const id = model.name.replace("models/", "");
        // Create a friendly label from the model ID
        const label = id
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase())
          .replace(/gemini/i, "Gemini")
          .replace(/flash/i, "Flash")
          .replace(/pro/i, "Pro")
          .replace(/lite/i, "Lite");
        
        return {
          value: id,
          label: label,
          description: model.description,
          version: model.version,
        };
      })
      ?.sort((a: any, b: any) => {
        // Sort by version (newer first) and then by name
        const versionA = parseFloat(a.version) || 0;
        const versionB = parseFloat(b.version) || 0;
        if (versionB !== versionA) return versionB - versionA;
        return a.label.localeCompare(b.label);
      }) || [];

    return NextResponse.json({ models });
  } catch (error: any) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch models" },
      { status: 500 }
    );
  }
}

"use server";

import { cookies } from "next/headers";
import { AIProvider, ModelId } from "@/modules/ai/types";

// Provider selection
export async function setProvider(value: AIProvider) {
  const cookieStore = await cookies();
  cookieStore.set("aiProvider", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getProvider(): Promise<AIProvider> {
  const cookieStore = await cookies();
  return (cookieStore.get("aiProvider")?.value as AIProvider) || "gemini";
}

// Provider-specific API keys
export async function setApiKey(provider: AIProvider, value: string) {
  const cookieStore = await cookies();
  cookieStore.set(`apiKey_${provider}`, value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getApiKey(provider?: AIProvider) {
  const cookieStore = await cookies();
  const currentProvider = provider || (await getProvider());
  return cookieStore.get(`apiKey_${currentProvider}`)?.value || null;
}

// Legacy API key functions (for backward compatibility)
export async function setLegacyApiKey(value: string) {
  const cookieStore = await cookies();
  cookieStore.set("apiKey", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getLegacyApiKey() {
  const cookieStore = await cookies();
  return cookieStore.get("apiKey")?.value || null;
}

export async function setModel(value: ModelId) {
  const cookieStore = await cookies();
  cookieStore.set("model", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getModel(): Promise<ModelId> {
  const cookieStore = await cookies();
  return (cookieStore.get("model")?.value as ModelId) || "gemini-2.5-flash";
}

export async function setChatModel(value: ModelId) {
  const cookieStore = await cookies();
  cookieStore.set("chatModel", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getChatModel(): Promise<ModelId> {
  const cookieStore = await cookies();
  return (cookieStore.get("chatModel")?.value as ModelId) || "gemini-2.5-flash";
}

export async function setCommandModel(value: ModelId) {
  const cookieStore = await cookies();
  cookieStore.set("commandModel", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getCommandModel(): Promise<ModelId> {
  const cookieStore = await cookies();
  return (
    (cookieStore.get("commandModel")?.value as ModelId) || "gemini-2.5-flash"
  );
}

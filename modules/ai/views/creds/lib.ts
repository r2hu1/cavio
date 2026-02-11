"use server";

import { cookies } from "next/headers";

export type ModelId = string;

export async function setApiKey(value: string) {
  const cookieStore = await cookies();
  cookieStore.set("apiKey", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getApiKey() {
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

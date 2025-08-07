"use client";
import { createContext, useContext, useState } from "react";

const AIChatInputContext = createContext<any>(null);

export const AiChatInputProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [value, setValue] = useState<any>(null);
  const [mode, setMode] = useState<any>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  return (
    <AIChatInputContext.Provider
      value={{ value, mode, setValue, setMode, pending, setPending, submitted, setSubmitted }}
    >
      {children}
    </AIChatInputContext.Provider>
  );
};

export const useAiChatInputState = () => useContext(AIChatInputContext);

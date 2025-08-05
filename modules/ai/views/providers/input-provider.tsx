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
  return (
    <AIChatInputContext.Provider value={{ value, mode, setValue, setMode }}>
      {children}
    </AIChatInputContext.Provider>
  );
};

export const useAiChatInputState = () => useContext(AIChatInputContext);

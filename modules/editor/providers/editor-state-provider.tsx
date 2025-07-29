"use client";
import { createContext, useContext, useState } from "react";

const EditorStateContext = createContext<any>(null);

export const EditorStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<boolean>(false);

  return (
    <EditorStateContext.Provider value={{ state, setState }}>
      {children}
    </EditorStateContext.Provider>
  );
};

export const useEditorState = () => useContext(EditorStateContext);

"use client";
import { createContext, useContext, useState } from "react";

const EditorStateContext = createContext<any>(null);

export const EditorStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<boolean>(false);
  const [excluded, setExcluded] = useState([]);

  return (
    <EditorStateContext.Provider
      value={{ state, setState, excluded, setExcluded }}
    >
      {children}
    </EditorStateContext.Provider>
  );
};

export const useEditorState = () => useContext(EditorStateContext);

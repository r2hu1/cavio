"use client";
import { createContext, useContext, useEffect, useState } from "react";

const EditorStateContext = createContext<any>(null);

export const EditorStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<boolean>(false);
  const [excluded, setExcluded] = useState([]);

  useEffect(() => {
    const e = localStorage.get("plugins");
    setExcluded((prev: any) =>
      e
        ? prev.filter((item: any) => item !== "autocomplete")
        : [...prev, "autocomplete"],
    );
  }, [excluded]);

  return (
    <EditorStateContext.Provider
      value={{ state, setState, excluded, setExcluded }}
    >
      {children}
    </EditorStateContext.Provider>
  );
};

export const useEditorState = () => useContext(EditorStateContext);

// hooks/useColumnShow.ts
"use client";
import { useAtomValue, useAtom } from "jotai";
import { tableData, vertex1AtomColumn, vertex2AtomColumn } from "../data/state";

export const useColumnShow = () => {
  const data = useAtomValue(tableData);
  const [vertex1, setVertex1] = useAtom(vertex1AtomColumn);
  const [vertex2, setVertex2] = useAtom(vertex2AtomColumn);

  return {
    headers: data?.headers || [],
    vertex1,
    setVertex1,
    vertex2,
    setVertex2,
  };
};

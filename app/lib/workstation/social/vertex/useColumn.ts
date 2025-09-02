import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { dataTable } from "../../data/state";

export function useDataColumn(targetColumn: string) {
  // memoize the derived atom so it's stable across renders
  const columnAtom = useMemo(
    () =>
      atom((get) => {
        const data = get(dataTable);
        return data.map((row) => row[targetColumn]);
      }),
    [targetColumn]
  );

  return useAtomValue(columnAtom);
}

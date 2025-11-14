import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";

import { dataTable } from "@/app/lib/data/state";

// use for getting specific column data from dataTable but rememberd data table is paginated

export function useDataColumn(targetColumn: string) {
  const columnAtom = useMemo(
    () =>
      atom((get) => {
        const data = get(dataTable);

        return data.map((row) => row[targetColumn]);
      }),
    [targetColumn],
  );

  return useAtomValue(columnAtom);
}

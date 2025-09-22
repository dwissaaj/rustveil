import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";

import { dataTable } from "../state";

export function useGetDataByColumn(targetColumn: string) {
  const columnData = useMemo(
    () =>
      atom((get) => {
        const data = get(dataTable);
        if (!targetColumn) return [];
        return data.map((row) => row[targetColumn] ?? null);
      }),
    [targetColumn],
  );

  return useAtomValue(columnData);
}

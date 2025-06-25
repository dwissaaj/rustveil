import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useSetAtom } from "jotai";
import { tableDataAtom, TableDataType } from "./dto"; // adjust path

export const useFileOpener = () => {
  const setTableData = useSetAtom(tableDataAtom);

  return async () => {
    try {
      const file = await open({
        multiple: false,
        directory: false,
      });

      if (!file) return;
       const data = await invoke<TableDataType>("load_data", { url: file });
      if (data) {
        setTableData(data);
      }
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };
};

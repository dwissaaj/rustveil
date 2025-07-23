import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useSetAtom } from "jotai";
import { filePath, sheetAvailable, sheetSelected } from "./state";

export const useexport = () => {
  const setSheets = useSetAtom(sheetAvailable);
  const setSelectedSheet = useSetAtom(sheetSelected);
  const setPath = useSetAtom(filePath);
  return async () => {
    try {
      // Open system file dialog
      const file = await open({
        multiple: false,
        directory: true,
      });
      if (!file) return;
      console.log(file);
      const sheets: string[] = await invoke("get_sheet", { url: file });
      setPath(file);
      setSheets(sheets);
      setSelectedSheet(sheets[0] || "");
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };
};

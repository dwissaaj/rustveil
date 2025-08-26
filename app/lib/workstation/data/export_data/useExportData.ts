import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useSetAtom } from "jotai";
import { filePath, sheetAvailable, sheetSelected } from "../state";
import { useState } from "react";

export const useFileOpener = () => {
  const setSheets = useSetAtom(sheetAvailable);
  const setSelectedSheet = useSetAtom(sheetSelected);
  const setPath = useSetAtom(filePath);
  const [isFile, setisFile] = useState(false);

  return async () => {
    try {
      // Open system file dialog
      const file = await open({
        multiple: false,
        directory: false,
      });

      if (file === null) {
        setPath({
          isSelected: false,
          url: "",
        });
        setSheets([]);
        setSelectedSheet("");
        return; // Exit early if no file selected
      }

      // Process the selected file
      //   setPath(file);
      const sheets: string[] = await invoke("get_sheet", { url: file });
      setSheets(sheets);
      setSelectedSheet(sheets[0] || "");
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };
};

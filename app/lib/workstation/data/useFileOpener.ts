import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useAtom, useSetAtom } from "jotai";
import { filePath, sheetAvailable, sheetSelected } from "./state";

export const useFileOpener = () => {
  const setSheets = useSetAtom(sheetAvailable);
  const setSelectedSheet = useSetAtom(sheetSelected);
  const [fileState, setFileState] = useAtom(filePath);
  return async () => {
    try {
      if (fileState.isSelected === false) {
        const file = await open({
          multiple: false,
          directory: false,
          filters: [
            {
              name: "Excel",
              extensions: ["xlsx"],
            },
          ],
        });
        if (file === null) {
          const newState = { isSelected: false, url: "" };
          setFileState(newState);
          return newState;
        }
        if (file) {
          const sheets: string[] = await invoke("get_sheet", { url: file });
          setSheets(sheets);
          setSelectedSheet(sheets[0] || "");
          const newState = { isSelected: true, url: file };
          setFileState(newState);
          return newState;
        }
      }
    } catch (error) {
      console.log("Error at loading file", error);
      const newState = { isSelected: false, url: "" };
      setFileState(newState);
      return newState;
    }
  };
};

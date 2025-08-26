// hooks/useLoadDatabase.ts
import { open } from "@tauri-apps/plugin-dialog";
import { useAtom } from "jotai";

import { invoke } from "@tauri-apps/api/core";
import { loadDatabase } from "../state";

export function useLoadDatabase() {
  const [fileState, setFileState] = useAtom(loadDatabase);

  const loadDatabaseHandler = async () => {
    try {
      if (fileState.isSelected === false) {
        const file = await open({
          multiple: false,
          directory: false,
          filters: [{
            name: "Sqlite",
            extensions: ["sqlite"],
          }],
        });
        
        if (file === null) {
          const newState = { isSelected: false, url: "" };
          setFileState(newState);
          return newState;
        }
        
        if (file) {
          const data = await invoke("load_data_sqlite", { pathfile: file });
          const newState = { isSelected: true, url: file };
          setFileState(newState);
          return data;
        }
      }
    } catch (error) {
      console.log("Error at loading file", error);
      throw error; // Re-throw to handle in component
    }
  };

  return loadDatabaseHandler; // Return the handler function
}
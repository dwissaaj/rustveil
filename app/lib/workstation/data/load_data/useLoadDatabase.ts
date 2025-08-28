import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useAtom, } from "jotai";
import { filePath } from "./../state";
export function useLoadDatabase() {

  const [fileState, setFileState] = useAtom(filePath);

  const databaseOpener = async () => {
    try {
      if (fileState.isSelected === false) {
        const file = await open({
          multiple: false,
          directory: false,
          filters: [
            {
              name: "Sqlite",
              extensions: ["sqlite"],
            },
          ],
        });
        if (file === null) {
          const newState = { isSelected: false, url: "" };
          setFileState(newState);
          return newState;
        }
        if (file) {
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
  return databaseOpener;
}

import { filePath } from "@/app/lib/data/state";
import { open } from "@tauri-apps/plugin-dialog";
import { useAtom } from "jotai";



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
    } catch {
      const newState = { isSelected: false, url: "" };

      setFileState(newState);

      return newState;
    }
  };

  return databaseOpener;
}

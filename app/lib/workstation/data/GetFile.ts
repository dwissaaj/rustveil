import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
export const FileOpener = async () => {
    try {
      const file = await open({
        multiple: false,
        directory: false,
      });
      await invoke("load_data", {url: file});
    } catch (error) {
      console.log("Error at get data or file");
    }
  };
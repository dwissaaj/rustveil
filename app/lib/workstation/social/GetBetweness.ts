import { invoke } from "@tauri-apps/api/core";
export const useGetBetweness = () => {

  return async () => {
    try {
      const data = await invoke("sayhello");
      console.log(data)
      return data
    } catch (error) {
      console.error("Error loading table data:", error);
    }
  };
};

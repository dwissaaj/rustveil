import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useSetAtom } from "jotai";
import { filePath, sheetAvailable, sheetSelected } from "./state";

/**
 * Custom hook for opening Excel files and loading sheet information
 *
 * @returns {Function} An async function that opens a file dialog and loads sheet names
 *
 * @example
 * // Usage in component:
 * const openFile = useFileOpener();
 *
 * <button onClick={openFile}>Open Excel</button>
 *
 * @description
 * This hook handles:
 * 1. File selection via system dialog
 * 2. Retrieving sheet names from Rust backend
 * 3. Updating Jotai state with file path and sheet information
 *
 * @throws {Error} Logs errors to console if file operations fail
 */
export const useFileOpener = () => {
  /**
   * Setter for available sheets (string[])
   * @type {Function}
   */
  const setSheets = useSetAtom(sheetAvailable);

  /**
   * Setter for currently selected sheet (string)
   * @type {Function}
   */
  const setSelectedSheet = useSetAtom(sheetSelected);

  /**
   * Setter for file path (string)
   * @type {Function}
   */
  const setPath = useSetAtom(filePath);

  /**
   * Opens file dialog and loads sheet names
   * @async
   * @returns {Promise<void>}
   */
  return async () => {
    try {
      // Open system file dialog
      const file = await open({
        multiple: false,
        directory: false,
      });

      if (!file) return;

      // Get sheet names from Rust backend
      const sheets: string[] = await invoke("get_sheet", { url: file });

      // Update application state
      setPath(file);
      setSheets(sheets);
      setSelectedSheet(sheets[0] || "");
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };
};

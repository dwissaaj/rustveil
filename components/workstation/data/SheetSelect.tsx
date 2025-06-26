import {
  sheetAvailable,
  sheetSelected,
} from "@/app/lib/workstation/data/state";
import { Select, SelectItem } from "@heroui/react";
import { useAtom } from "jotai";

/**
 * Dropdown component for selecting Excel sheets
 *
 * @component
 * @example
 * // Usage in parent component:
 * <SheetSelector />
 *
 * @description
 * Displays a styled dropdown menu of available Excel sheets.
 * Automatically shows/hides based on available sheets.
 * Syncs selection with Jotai global state.
 *
 * @props
 * - Uses `sheetAvailable` atom for available sheets (string[])
 * - Uses `sheetSelected` atom for current selection (string)
 *
 * @ui
 * - Hero UI's Select component
 * - Minimum width of 200px
 * - Small size variant
 */
export default function SheetSelector() {
  /**
   * Array of available sheet names from global state
   * @type {[string[], Function]}
   */
  const [sheets] = useAtom(sheetAvailable);

  /**
   * Currently selected sheet and its setter from global state
   * @type {[string, Function]}
   */
  const [selectedSheet, setSelectedSheet] = useAtom(sheetSelected);

  return (
    <div>
      {sheets.length > 0 && (
        <Select
          label="Select Sheet"
          selectedKeys={[selectedSheet]}
          onSelectionChange={(keys) =>
            setSelectedSheet(Array.from(keys)[0]?.toString() || "")
          }
          className="min-w-[200px]"
          size="sm"
        >
          {sheets.map((sheet) => (
            <SelectItem key={sheet}>{sheet}</SelectItem>
          ))}
        </Select>
      )}
    </div>
  );
}

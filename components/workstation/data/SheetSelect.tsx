import {
  sheetAvailable,
  sheetSelected,
} from "@/app/lib/workstation/data/state";
import { Select, SelectItem } from "@heroui/react";
import { useAtom } from "jotai";

export default function SheetSelector() {
  const [sheets] = useAtom(sheetAvailable);
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

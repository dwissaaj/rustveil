import { Select, SelectItem } from "@heroui/react";
import { useAtom } from "jotai";

import { sheetAvailable, sheetSelected } from "@/app/lib/data/state";

export default function SheetSelector() {
  const [sheets] = useAtom(sheetAvailable);
  const [selectedSheet, setSelectedSheet] = useAtom(sheetSelected);

  return (
    <div>
      {sheets.length > 0 && (
        <Select
          className="min-w-[200px]"
          label="Select Sheet"
          selectedKeys={[selectedSheet]}
          size="sm"
          onSelectionChange={(keys) =>
            setSelectedSheet(Array.from(keys)[0]?.toString() || "")
          }
        >
          {sheets.map((sheet) => (
            <SelectItem key={sheet}>{sheet}</SelectItem>
          ))}
        </Select>
      )}
    </div>
  );
}

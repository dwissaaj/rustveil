// DataFilter.tsx
"use client";
import DataExport from "@/app/work/(workgroup)/data/DataExport";
import DataFilterList from "@/app/work/(workgroup)/data/picker/DataFilterList";

export default function FilterListWrapper() {
  return (
    <div className="flex flex-row gap-4 border-b py-2 items-center">
      <div>
        <DataFilterList />
      </div>
      <div>
        <DataExport />
      </div>
    </div>
  );
}

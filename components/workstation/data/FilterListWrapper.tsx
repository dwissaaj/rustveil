// app/work/(workgroup)/data/FilterListWrapper.tsx
"use client";

import DataFileDropdown from "@/app/work/(workgroup)/data/dropdown/DataFileDropdown";
import { ViewDropdown } from "@/app/work/(workgroup)/data/dropdown/ViewDropdown";


export default function FilterListWrapper() {
  return (
    <div className="flex flex-row gap-4 border-b py-2 items-center">
      <div>
        <DataFileDropdown />
      </div>
      <div>
        <ViewDropdown  />
      </div>
    </div>
  );
}
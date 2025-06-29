// DataFilter.tsx
"use client";
import DataExport from "@/app/work/(workgroup)/data/DataExport";
import DataFilterList from "@/app/work/(workgroup)/data/DataFilterList";

import { addToast, Button, Toast } from "@heroui/react";

export default function FilterListWrapper() {
  return (
    <div className="flex flex-row gap-4 border-b py-2 items-center">
      <div>
        <DataFilterList />
      </div>
      <div>
        <Button
          variant="flat"
          onPress={() => {
            addToast({
              title: "Toast Title",
              color: "danger",
            });
          }}
        >
          Default
        </Button>
      </div>
    </div>
  );
}

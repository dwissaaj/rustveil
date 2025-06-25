"use client";
import { Button } from "@heroui/button";
import { useFileOpener } from "@/app/lib/workstation/data/GetFile";
export default function DataFilter() {
  return (
    <div className="w-full border-b border-white/80 p-2 dark:bg-[#0D1117] shadow-md shadow-white/50">
      <Button color="secondary" variant="light" onPress={useFileOpener()}>
        Get File
      </Button>
    </div>
  );
}

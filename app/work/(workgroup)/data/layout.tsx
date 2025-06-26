"use client";

import { ReactNode } from "react";
import DataFilter from "@/app/work/(workgroup)/data/DataPicker";

export default function DataLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <p className="text-5xl">✅ Layout asdasdasd</p>
      <DataFilter />
      <main>{children}</main>
    </div>
  );
}

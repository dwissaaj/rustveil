"use client";

import DataFilter from "@/components/workstation/DataFilter";
import { ReactNode } from "react";

export default function DataLayout({ children }: { children: ReactNode }) {
  return (
    <div>
  <p>✅ Layout loaded</p>
  <DataFilter />
  <main>{children}</main>
</div>

  );
}

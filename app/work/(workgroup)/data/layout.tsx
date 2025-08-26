import { Alert } from "@heroui/react";
import { ReactNode } from "react";

export default function DataLayout({ children }: { children: ReactNode }) {
  return <main>
    {children}</main>;
}

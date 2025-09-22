import { ReactNode } from "react";

export default function SentimentLayout({ children }: { children: ReactNode }) {
  return <main className="p-4">{children}</main>;
}

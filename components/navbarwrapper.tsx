"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./NavigationApp";

export default function NavbarWrapper() {
  const pathname = usePathname();
  return pathname === "/" ? <Navbar /> : null;
}

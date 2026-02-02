"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/onboarding" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/lesson/");

  if (hideNavbar) return null;

  return <Navbar />;
}

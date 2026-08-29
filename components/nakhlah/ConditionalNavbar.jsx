"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const { status } = useSession();

  const isAuthPage =
    pathname === "/onboarding" ||
    pathname === "/get-started" ||
    pathname.startsWith("/auth/") ||
    pathname === "/lesson" ||
    pathname.startsWith("/lesson/") ||
    pathname === "/lessons" ||
    pathname.startsWith("/lessons/");

  if (isAuthPage || status !== "authenticated") return null;

  return <Navbar />;
}

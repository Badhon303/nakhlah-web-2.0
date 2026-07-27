"use client";

import { usePathname } from "next/navigation";
import { ToastProvider } from "./nakhlah/Toast/ToastProvider";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/onboarding" ||
    pathname === "/get-started" ||
    pathname.startsWith("/auth/") ||
    pathname === "/lesson" ||
    pathname.startsWith("/lesson/") ||
    pathname === "/lessons" ||
    pathname.startsWith("/lessons/");

  return (
    <div className="">
      <main
        className={
          hideNavbar
            ? "pb-[var(--sab)]"
            : "min-h-[100dvh] lg:min-h-screen lg:pl-64 pb-[calc(5rem+var(--sab))] lg:pb-0"
        }
      >
        <ToastProvider />
        {children}
      </main>
    </div>
  );
}

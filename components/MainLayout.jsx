"use client";

import { usePathname } from "next/navigation";
import { ToastProvider } from "./nakhlah/Toast/ToastProvider";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isLesson =
    pathname === "/lesson" ||
    pathname.startsWith("/lesson/") ||
    pathname === "/lessons" ||
    pathname.startsWith("/lessons/");
  const hideNavbar =
    isLesson ||
    pathname === "/onboarding" ||
    pathname === "/get-started" ||
    pathname.startsWith("/auth/");

  return (
    <div className="">
      <main
        className={
          isLesson
            ? ""
            : hideNavbar
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

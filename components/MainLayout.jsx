"use client";

import { usePathname } from "next/navigation";
import { ToastProvider } from "./nakhlah/Toast/ToastProvider";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/onboarding" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/lesson/");

  return (
    <div className="">
      <main
        className={
          hideNavbar ? "" : "sm:min-h-[calc(100vh_-_64px)] md:pl-64 pb-20 md:pb-0"
        }
      >
        <ToastProvider />
        {children}
      </main>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { ToastProvider } from "./nakhlah/Toast/ToastProvider";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/onboarding" || pathname.startsWith("/auth/");

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <main className={hideNavbar ? "" : "md:pt-16 pb-20 sm:pb-0"}>
        <ToastProvider />
        {children}
      </main>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/onboarding" || pathname === "/get-started";

  return (
    <div className="min-h-screen">
      <main className={hideNavbar ? "" : "pt-16 pb-20 md:pb-0"}>
        {children}
      </main>
    </div>
  );
}
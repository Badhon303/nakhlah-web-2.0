"use client";

import { AuthProvider } from "@/lib/auth-client";
import BackNavigationGuard from "@/components/nakhlah/BackNavigationGuard";

export default function SessionProvider({ children }) {
  return (
    <AuthProvider>
      <BackNavigationGuard />
      {children}
    </AuthProvider>
  );
}


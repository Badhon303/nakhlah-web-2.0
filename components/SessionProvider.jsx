"use client";

import { AuthProvider } from "@/lib/auth-client";

export default function SessionProvider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

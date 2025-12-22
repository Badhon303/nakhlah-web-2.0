"use client";

import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/nakhlah/Navbar";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/onboarding" || pathname === "/get-started";
  
  // Initialize QueryClient inside the client component
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!hideNavbar && <Navbar />}
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
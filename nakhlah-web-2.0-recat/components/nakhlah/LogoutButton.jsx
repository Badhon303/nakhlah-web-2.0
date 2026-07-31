"use client";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/services/api/auth";

export function LogoutButton({
  variant = "ghost",
  className = "",
  redirectTo = "/auth/login",
  showIcon = true,
  children = "Logout",
}) {
  const handleLogout = async () => {
    try {
      await logoutUser();
      await signOut({ redirect: true, callbackUrl: redirectTo });
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect to login even if logout fails
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    }
  };

  return (
    <Button variant={variant} onClick={handleLogout} className={className}>
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
}

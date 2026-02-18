"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "@/components/nakhlah/Toast";

export function LogoutButton({
  variant = "ghost",
  className = "",
  redirectTo = "/auth/login",
  showIcon = true,
  children = "Logout",
}) {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: redirectTo });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      className={className}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile?view=settings");
  }, [router]);

  return <div className="min-h-screen bg-background" />;
}

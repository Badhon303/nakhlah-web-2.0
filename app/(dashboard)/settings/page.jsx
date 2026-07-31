"use client";
import { Suspense } from "react";
import ProfileAndSettingsContent from "../profile/ProfileAndSettingsContent";

export default function Home() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-background overflow-hidden" />}
    >
      <ProfileAndSettingsContent basePath="/settings" defaultView="settings" />
    </Suspense>
  );
}

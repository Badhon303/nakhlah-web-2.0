"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { ConfirmPrompt } from "@/components/nakhlah/ConfirmPrompt";

export default function CapacitorInit() {
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let backButtonListener = null;

    (async () => {
      try {
        const { Capacitor, SystemBars } = await import("@capacitor/core");
        if (!Capacitor?.isNativePlatform?.()) return;

        // Android 15+ enforces edge-to-edge and ignores statusBarColor /
        // setOverlaysWebView, so the bars are only styled here and the layout
        // keeps clear of them via the injected --safe-area-inset-* variables.
        try {
          await SystemBars?.setStyle?.({ style: "LIGHT" });
        } catch {}
        if (cancelled) return;

        // Handle hardware back button
        const { App } = await import("@capacitor/app");
        if (cancelled) return;

        backButtonListener = await App.addListener(
          "backButton",
          ({ canGoBack }) => {
            if (canGoBack) {
              window.history.back();
            } else {
              setShowExitDialog(true);
            }
          },
        );
      } catch {}
    })();

    return () => {
      cancelled = true;
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, []);

  const handleExitConfirm = async () => {
    setShowExitDialog(false);
    try {
      const { App } = await import("@capacitor/app");
      App.exitApp();
    } catch {}
  };

  return (
    <ConfirmPrompt
      open={showExitDialog}
      onOpenChange={setShowExitDialog}
      icon={LogOut}
      title="Exit Nakhlah?"
      description="You are about to close the app. Your progress is already saved."
      confirmLabel="Exit App"
      cancelLabel="Keep Learning"
      onConfirm={handleExitConfirm}
    />
  );
}

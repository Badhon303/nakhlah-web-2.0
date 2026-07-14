"use client";

import { useEffect, useState } from "react";

export default function CapacitorInit() {
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let backButtonListener = null;

    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor?.isNativePlatform?.()) return;

        const { StatusBar, Style } = await import("@capacitor/status-bar");
        if (cancelled) return;

        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#8249DF" });

        try {
          await StatusBar.setOverlaysWebView({ overlay: false });
        } catch {}

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
          }
        );
      } catch {}
    })();

    // CSS padding fallback: detect status bar height and apply as CSS variable
    const detectStatusBarHeight = () => {
      let height = 0;

      // Method 1: env(safe-area-inset-top)
      try {
        const el = document.createElement("div");
        el.style.cssText =
          "position:absolute;top:0;left:0;visibility:hidden;padding-top:env(safe-area-inset-top);";
        document.body.appendChild(el);
        height = parseInt(getComputedStyle(el).paddingTop) || 0;
        document.body.removeChild(el);
      } catch {}

      // Method 2: outerHeight - innerHeight
      if (height === 0 && typeof window.outerHeight === "number") {
        const diff = window.outerHeight - window.innerHeight;
        if (diff > 0 && diff < 100) height = diff;
      }

      // Method 3: screen height difference
      if (height === 0 && window.screen) {
        const diff = (window.screen.height || 0) - (window.screen.availHeight || 0);
        if (diff > 0 && diff < 100) height = diff;
      }

      // Method 4: default Android status bar height (24dp ≈ 24 CSS px)
      if (height === 0) {
        height = 24;
      }

      document.documentElement.style.setProperty(
        "--capacitor-status-bar-height",
        height + "px",
      );
    };

    detectStatusBarHeight();

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

  const handleExitCancel = () => {
    setShowExitDialog(false);
  };

  if (!showExitDialog) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          background: "hsl(0 0% 100%)",
          borderRadius: 16,
          padding: 24,
          maxWidth: 320,
          width: "85%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 8,
            color: "hsl(0 0% 10%)",
          }}
        >
          Exit App?
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "hsl(0 0% 40%)",
            marginBottom: 20,
          }}
        >
          Do you want to close the app?
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={handleExitCancel}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid hsl(0 0% 85%)",
              background: "transparent",
              fontSize: 14,
              fontWeight: 600,
              color: "hsl(0 0% 30%)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExitConfirm}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 12,
              border: "none",
              background: "#8249DF",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
            }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}



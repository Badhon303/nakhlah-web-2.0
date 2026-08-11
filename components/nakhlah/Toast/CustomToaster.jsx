"use client";

import { useEffect } from "react";
import { Toaster as Sonner, toast } from "sonner";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { CheckCircle2, XCircle, Info, AlertCircle } from "lucide-react";
import styles from "./CustomToaster.module.css";

const NAVIGATION_TOAST_KEY = "nakhlah:pending-navigation-toast";
const NAVIGATION_TOAST_MAX_AGE_MS = 30000;

export function queueToastAfterNavigation(type, message) {
  if (typeof window === "undefined" || !message) return;

  sessionStorage.setItem(
    NAVIGATION_TOAST_KEY,
    JSON.stringify({
      type,
      message,
      createdAt: Date.now(),
    }),
  );
}

export function CustomToaster() {
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const rawToast = sessionStorage.getItem(NAVIGATION_TOAST_KEY);
    if (!rawToast) return undefined;

    sessionStorage.removeItem(NAVIGATION_TOAST_KEY);

    try {
      const pendingToast = JSON.parse(rawToast);
      const isFresh =
        Date.now() - Number(pendingToast?.createdAt || 0) <
        NAVIGATION_TOAST_MAX_AGE_MS;
      const toastType = pendingToast?.type || "message";
      const toastMessage = pendingToast?.message;

      if (!isFresh || !toastMessage) return undefined;

      const timerId = window.setTimeout(() => {
        if (typeof toast[toastType] === "function") {
          toast[toastType](toastMessage);
          return;
        }

        toast(toastMessage);
      }, 150);

      return () => window.clearTimeout(timerId);
    } catch {
      return undefined;
    }
  }, [pathname]);

  return (
    <div className={styles["toast-progress"]}>
      <Sonner
        theme={theme}
        position="bottom-right"
        toastOptions={{
          unstyled: true,
          style: { "--toast-duration": "6000ms" },
          classNames: {
            toast:
              "group pointer-events-auto relative flex w-[min(380px,calc(100vw-2rem))] items-center gap-3 rounded-2xl border-0 px-4 py-3.5 pr-10 shadow-xl transition-all",
            icon: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white",
            content: "min-w-0 flex-1",
            title: "text-base font-bold leading-tight text-white",
            description:
              "mt-0.5 text-sm font-medium leading-relaxed text-white/90",
            actionButton:
              "ml-3 inline-flex h-9 shrink-0 items-center justify-center rounded-xl bg-white px-4 text-sm font-bold shadow-md transition-transform active:scale-95 group-data-[type=success]:text-emerald-600 group-data-[type=error]:text-red-600 group-data-[type=warning]:text-amber-600 group-data-[type=info]:text-sky-600 group-data-[type=message]:text-sky-600 group-data-[type=default]:text-sky-600",
            cancelButton:
              "ml-3 inline-flex h-9 shrink-0 items-center justify-center rounded-xl bg-white/20 px-4 text-sm font-bold text-white transition-transform active:scale-95 hover:bg-white/30",
            closeButton:
              "absolute right-2 top-2 left-auto grid h-6 w-6 place-items-center rounded-none border-0 bg-transparent p-0 text-white opacity-70 shadow-none transition-opacity hover:bg-transparent hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0",
            success: "bg-emerald-600 text-white",
            error: "bg-red-600 text-white",
            warning: "bg-amber-500 text-white",
            info: "bg-sky-600 text-white",
            default: "bg-sky-600 text-white",
            message: "bg-sky-600 text-white",
          },
        }}
        icons={{
          success: <CheckCircle2 className="w-5 h-5" />,
          error: <XCircle className="w-5 h-5" />,
          warning: <AlertCircle className="w-5 h-5" />,
          info: <Info className="w-5 h-5" />,
        }}
        className="z-[100] [&_[data-close-button]]:!left-auto [&_[data-close-button]]:!right-2 [&_[data-close-button]]:!top-2 [&_[data-close-button]]:!translate-x-0 [&_[data-close-button]]:!translate-y-0 [&_[data-close-button]]:!border-0 [&_[data-close-button]]:!bg-transparent [&_[data-close-button]]:!shadow-none [&_[data-close-button]>svg]:h-3.5 [&_[data-close-button]>svg]:w-3.5"
        duration={6000}
        closeButton
        richColors={false}
        expand={false}
        visibleToasts={3}
      />
    </div>
  );
}

/**
 * Toast helper function with app-specific styling
 */
export { toast } from "sonner";

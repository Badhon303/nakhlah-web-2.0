"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";
import { CheckCircle2, XCircle, Info, AlertCircle } from "lucide-react";

export function CustomToaster() {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group flex items-center gap-3 w-full sm:w-[380px] p-4 rounded-xl border-2 shadow-lg backdrop-blur-sm transition-all",
          title: "font-bold text-base",
          description: "text-sm opacity-90 mt-1",
          actionButton:
            "px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity",
          cancelButton:
            "px-4 py-2 rounded-lg bg-muted text-muted-foreground font-semibold hover:opacity-90 transition-opacity",
          closeButton:
            "absolute top-2 right-2 p-1 rounded-lg hover:bg-muted/50 transition-colors",
          success:
            "bg-green-50 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-200",
          error:
            "bg-red-50 dark:bg-red-900/40 border-red-500 text-red-800 dark:text-red-200",
          warning:
            "bg-amber-50 dark:bg-amber-900/40 border-amber-500 text-amber-800 dark:text-amber-200",
          info: "bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-800 dark:text-blue-200",
          default:
            "bg-card border-border text-foreground",
        },
      }}
      icons={{
        success: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
        error: <XCircle className="w-5 h-5 flex-shrink-0" />,
        warning: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
        info: <Info className="w-5 h-5 flex-shrink-0" />,
      }}
      // Mobile positioning: bottom center, desktop: bottom right
      className="
        fixed
        bottom-4 left-4 right-4
        sm:bottom-4 sm:right-4 sm:left-auto
        flex flex-col gap-2
        z-[100]
      "
      duration={4000}
      closeButton
      richColors={false}
      expand={false}
      visibleToasts={3}
    />
  );
}

/**
 * Toast helper function with app-specific styling
 */
export { toast } from "sonner";

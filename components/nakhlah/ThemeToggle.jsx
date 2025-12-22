"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle({
  className,
  variant = "default",
}) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  const toggle = () => setIsDark((v) => !v);


  if (variant === "icon") {
    return (
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className={cn(
          "relative flex items-center justify-center",
          className
        )}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.6, rotate: 90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Moon className="h-6 w-6 text-accent-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0.6, rotate: 90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.6, rotate: -90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Sun className="h-6 w-6 text-orange-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }

  /*  DESKTOP TOGGLE */
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "relative flex h-10 w-20 items-center rounded-full border-2 border-border p-1 transition-colors hover:border-accent",
        className
      )}
    >
      <motion.div
        layout
        animate={{ x: isDark ? 36 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full shadow-sm",
          isDark ? "bg-accent" : "bg-primary"
        )}
      >
        {isDark ? (
          <Moon className="h-6 w-6 text-accent-foreground" />
        ) : (
          <Sun className="h-6 w-6 text-primary-foreground" />
        )}
      </motion.div>
    </button>
  );
}

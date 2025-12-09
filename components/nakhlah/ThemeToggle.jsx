import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ThemeToggle({ className }) {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={cn(
        "relative flex h-10 w-20 items-center rounded-full border-2 border-border bg-muted p-1 transition-colors hover:border-accent",
        className
      )}
      aria-label="Toggle theme"
    >
      <motion.div
        layout
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full shadow-sm",
          isDark ? "bg-accent" : "bg-primary"
        )}
        animate={{ x: isDark ? 36 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-accent-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-primary-foreground" />
        )}
      </motion.div>
    </button>
  );
}

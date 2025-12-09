import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressSteps({
  steps,
  currentStep,
  className,
}) {
  const percent = Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className={cn("w-full", className)}>
      {/* optional step labels */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1 mb-4">
        {steps.map((s) => (
          <div key={s.id} className="flex-1 text-center">
            <div
              className={cn(
                "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                s.id <= currentStep
                  ? "bg-violet-100 text-accent"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {s.id}
            </div>
            <div
              className={cn(
                "mt-1",
                s.id <= currentStep ? "text-accent" : "text-muted-foreground"
              )}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {/* thin violet slider */}
      <div className="w-full h-2 bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="h-full bg-accent shadow-sm"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

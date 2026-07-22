"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";

export function AgeStep({ title, ages = [], selectedAge, onSelect }) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-center gap-6 justify-center"
      >
        <FreshDateMascot mood="happy" size="xl" />
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">Select your age range</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {ages.map((ageOption, index) => (
          <motion.button
            key={ageOption.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(ageOption.id)}
            className={cn(
              "relative flex items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300",
              "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
              selectedAge === ageOption.id
                ? "border-accent bg-accent/10 shadow-accent-glow"
                : "border-border bg-card hover:border-primary",
            )}
          >
            <p
              className={cn(
                "text-center text-lg font-bold",
                selectedAge === ageOption.id
                  ? "text-accent"
                  : "text-foreground",
              )}
            >
              {ageOption.ageTitle}
            </p>
            {selectedAge === ageOption.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
              >
                <svg
                  className="w-3 h-3 text-accent-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

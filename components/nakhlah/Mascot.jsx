import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Mascot({
  mood = "happy",
  size = "md",
  className,
  message,
}) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className={cn("relative", sizeClasses[size])}
      >
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="50" cy="70" rx="35" ry="45" className="fill-accent" />
          <ellipse cx="40" cy="55" rx="12" ry="18" className="fill-accent/60" />
          <ellipse cx="35" cy="60" rx="8" ry="10" className="fill-card" />
          <ellipse cx="65" cy="60" rx="8" ry="10" className="fill-card" />
          <ellipse cx="37" cy="62" rx="4" ry="5" className="fill-foreground" />
          <ellipse cx="67" cy="62" rx="4" ry="5" className="fill-foreground" />
          <circle cx="34" cy="59" r="1.5" className="fill-card" />
          <circle cx="64" cy="59" r="1.5" className="fill-card" />
          <path d="M 35 80 Q 50 90 65 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="stroke-card" fill="none" />
          <circle cx="25" cy="72" r="5" className="fill-primary opacity-50" />
          <circle cx="75" cy="72" r="5" className="fill-primary opacity-50" />
          <path d="M 50 25 C 30 15 15 20 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="stroke-secondary" fill="none" />
          <path d="M 50 25 C 50 10 45 5 50 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="stroke-secondary" fill="none" />
          <path d="M 50 25 C 70 15 85 20 90 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="stroke-secondary" fill="none" />
        </svg>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-4 relative"
        >
          <div className="bg-card border-2 border-border rounded-2xl px-4 py-3 shadow-md max-w-xs">
            <p className="text-sm font-medium text-foreground text-center">{message}</p>
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-l-2 border-t-2 border-border rotate-45" />
        </motion.div>
      )}
    </div>
  );
}

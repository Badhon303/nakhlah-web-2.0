"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * ArabicTooltip component for displaying pronunciation tooltips on Arabic words.
 * @param {string} text - The Arabic text to display
 * @param {string} pronunciation - The pronunciation word to show in tooltip
 * @param {string} children - Child content
 */
export function ArabicTooltip({ text, pronunciation }) {
  const [open, setOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isTouch) setOpen(true);
  }, [isTouch]);

  const handleMouseLeave = useCallback(() => {
    if (!isTouch) setOpen(false);
  }, [isTouch]);

  const handleClick = useCallback(() => {
    if (isTouch) setOpen((prev) => !prev);
  }, [isTouch]);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <span
            className="cursor-help border-b border-dotted border-foreground/30 hover:border-foreground/60 hover:text-accent transition-colors select-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            {text}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-foreground text-background">
          <p className="text-sm font-medium">{pronunciation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

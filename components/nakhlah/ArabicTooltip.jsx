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
 * @param {boolean} isOpen - Controlled open state
 * @param {function} onOpenChange - Controlled open state change callback
 */
export function ArabicTooltip({
  text,
  pronunciation,
  isOpen: isOpenProp,
  onOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const isControlled = isOpenProp !== undefined;
  const open = isControlled ? isOpenProp : internalOpen;

  const setOpen = useCallback(
    (next) => {
      onOpenChange?.(next);
      if (!isControlled) setInternalOpen(next);
    },
    [isControlled, onOpenChange],
  );

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
  }, [isTouch, setOpen]);

  const handleMouseLeave = useCallback(() => {
    if (!isTouch) setOpen(false);
  }, [isTouch, setOpen]);

  const handleClick = useCallback(() => {
    if (isTouch) setOpen(!open);
  }, [isTouch, open, setOpen]);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <span
            className={`cursor-help border-b border-dotted transition-colors select-none ${
              open
                ? "text-accent border-foreground/60"
                : "border-foreground/30 hover:border-foreground/60 hover:text-accent"
            }`}
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

"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_MAX_PALM_STOCK,
  formatRefillCountdown,
  getPalmRefillState,
} from "@/lib/gamification";

/**
 * Live countdown to the next free Palm Tree refill, derived from the
 * server-provided `palmUpdatedAt` timestamp (1 Palm Tree per hour).
 * Ticks every second while stock is below max, and stops once full.
 */
export function usePalmRefillCountdown(
  palmUpdatedAt,
  palmStock,
  maxPalmStock = DEFAULT_MAX_PALM_STOCK,
) {
  const [state, setState] = useState(() =>
    getPalmRefillState(palmUpdatedAt, palmStock, maxPalmStock),
  );

  useEffect(() => {
    setState(getPalmRefillState(palmUpdatedAt, palmStock, maxPalmStock));

    if (Number(palmStock) >= maxPalmStock) {
      return undefined;
    }

    const interval = setInterval(() => {
      setState(getPalmRefillState(palmUpdatedAt, palmStock, maxPalmStock));
    }, 1000);

    return () => clearInterval(interval);
  }, [palmUpdatedAt, palmStock, maxPalmStock]);

  return {
    ...state,
    formatted: state.isFull ? null : formatRefillCountdown(state.msRemaining),
  };
}

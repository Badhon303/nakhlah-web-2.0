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
    const sync = () =>
      setState(getPalmRefillState(palmUpdatedAt, palmStock, maxPalmStock));

    sync();

    const refill = getPalmRefillState(palmUpdatedAt, palmStock, maxPalmStock);
    if (refill.isFull || refill.msRemaining == null) {
      return undefined;
    }

    const interval = setInterval(sync, 1000);
    const syncIfVisible = () => {
      if (document.visibilityState === "visible") sync();
    };

    document.addEventListener("visibilitychange", syncIfVisible);
    window.addEventListener("focus", sync);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", syncIfVisible);
      window.removeEventListener("focus", sync);
    };
  }, [palmUpdatedAt, palmStock, maxPalmStock]);

  return {
    ...state,
    formatted:
      state.isFull || state.msRemaining == null
        ? null
        : formatRefillCountdown(state.msRemaining),
  };
}

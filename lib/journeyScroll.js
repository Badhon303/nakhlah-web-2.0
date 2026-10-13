const JOURNEY_HOLD_SCROLL_KEY = "nakhlah:journey-hold-scroll";
const JOURNEY_SCROLL_ROOT = "[data-journey-scroll]";

export function rememberJourneyScroll() {
  if (typeof window === "undefined") return;
  const path = document.querySelector(JOURNEY_SCROLL_ROOT);
  sessionStorage.setItem(
    JOURNEY_HOLD_SCROLL_KEY,
    JSON.stringify({
      windowY: window.scrollY || 0,
      pathY: path ? path.scrollTop : 0,
    }),
  );
}

export function takeRememberedJourneyScroll() {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(JOURNEY_HOLD_SCROLL_KEY);
  if (raw == null) return null;
  sessionStorage.removeItem(JOURNEY_HOLD_SCROLL_KEY);

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        windowY: Number(parsed.windowY) || 0,
        pathY: Number(parsed.pathY) || 0,
      };
    }
  } catch {
    // Older values were a single scroll offset.
  }

  const y = Number(raw);
  return Number.isFinite(y) ? { windowY: y, pathY: 0 } : null;
}

export function applyJourneyScroll(saved) {
  if (!saved || typeof window === "undefined") return;
  window.scrollTo({ top: saved.windowY, left: 0, behavior: "instant" });
  const path = document.querySelector(JOURNEY_SCROLL_ROOT);
  if (path) path.scrollTop = saved.pathY;
}

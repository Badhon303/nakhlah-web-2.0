export const JOURNEY_HOLD_SCROLL_KEY = "nakhlah:journey-hold-scroll";
export const JOURNEY_LAND_ON_NEW_GIFT_KEY = "nakhlah:journey-land-on-new-gift";
const LEGACY_JOURNEY_SCROLL_NODE_KEY = "nakhlah:journey-scroll-node";

// Survives a dev remount in the same page load. Login clears it.
let pendingLandOnNewGift = false;

export function markJourneyLandOnNewGift() {
  pendingLandOnNewGift = true;
  if (typeof window === "undefined") return;
  sessionStorage.setItem(JOURNEY_LAND_ON_NEW_GIFT_KEY, "1");
}

export function readJourneyLandOnNewGift() {
  if (typeof window === "undefined") return pendingLandOnNewGift;
  if (sessionStorage.getItem(JOURNEY_LAND_ON_NEW_GIFT_KEY) === "1") {
    pendingLandOnNewGift = true;
  }
  return pendingLandOnNewGift;
}

export function finishJourneyLandOnNewGift() {
  pendingLandOnNewGift = false;
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(JOURNEY_LAND_ON_NEW_GIFT_KEY);
}

export function rememberJourneyScroll(scrollY) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(JOURNEY_HOLD_SCROLL_KEY, String(scrollY || 0));
}

export function takeRememberedJourneyScroll() {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(JOURNEY_HOLD_SCROLL_KEY);
  if (raw == null) return null;
  sessionStorage.removeItem(JOURNEY_HOLD_SCROLL_KEY);
  const y = Number(raw);
  return Number.isFinite(y) ? y : null;
}

export function clearJourneyScrollOverrides() {
  pendingLandOnNewGift = false;
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(JOURNEY_HOLD_SCROLL_KEY);
  sessionStorage.removeItem(JOURNEY_LAND_ON_NEW_GIFT_KEY);
  sessionStorage.removeItem(LEGACY_JOURNEY_SCROLL_NODE_KEY);
}

const LESSON_UNLOCKED_BADGES_KEY = "lessonUnlockedBadges";

let memoryUnlockedBadgeKeys = [];

const toBadgeKey = (item) => {
  if (typeof item === "string") return item.trim();
  if (!item || typeof item !== "object") return "";
  return String(item.key || item.id || item.name || item.title || "").trim();
};

const coerceBadgeList = (value) => {
  if (!value) return [];
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(coerceBadgeList);
  if (typeof value === "object") {
    const nested =
      value.added ??
      value.Added ??
      value.new ??
      value.unlocked ??
      value.earned;
    if (nested !== undefined) return coerceBadgeList(nested);

    const direct = toBadgeKey(value);
    if (direct) return [direct];

    return Object.keys(value).filter(Boolean);
  }
  return [];
};

export function extractUnlockedBadgeKeys(payload) {
  if (payload == null) return [];

  if (typeof payload === "string" || Array.isArray(payload)) {
    return [...new Set(coerceBadgeList(payload))];
  }

  if (typeof payload !== "object") return [];

  const candidates = [
    payload.badges?.added,
    payload.badges?.Added,
    payload.badge?.added,
    payload.addedBadges,
    payload.newBadges,
    payload.unlockedBadges,
    payload.data?.badges?.added,
    payload.reward?.badges?.added,
    payload.dailyQuest?.badges?.added,
  ];

  const keys = candidates.flatMap(coerceBadgeList);
  return [...new Set(keys.filter(Boolean))];
}

export function persistUnlockedBadgeKeys(payload) {
  if (typeof window === "undefined") return [];

  const uniqueKeys = extractUnlockedBadgeKeys(payload);
  if (!uniqueKeys.length) return readUnlockedBadgeKeys();

  memoryUnlockedBadgeKeys = uniqueKeys;
  sessionStorage.setItem(
    LESSON_UNLOCKED_BADGES_KEY,
    JSON.stringify(uniqueKeys),
  );
  return uniqueKeys;
}

export function readUnlockedBadgeKeys() {
  if (typeof window === "undefined") return [...memoryUnlockedBadgeKeys];

  const raw = sessionStorage.getItem(LESSON_UNLOCKED_BADGES_KEY);
  if (!raw) return [...memoryUnlockedBadgeKeys];

  try {
    const stored = extractUnlockedBadgeKeys(JSON.parse(raw));
    if (stored.length) {
      memoryUnlockedBadgeKeys = stored;
      return stored;
    }
  } catch {
    // fall through to memory
  }

  return [...memoryUnlockedBadgeKeys];
}

export function clearUnlockedBadgeKeys() {
  memoryUnlockedBadgeKeys = [];
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LESSON_UNLOCKED_BADGES_KEY);
}

export function getPostCompletedPath() {
  return readUnlockedBadgeKeys().length
    ? "/lesson/badge-unlocked"
    : "/lesson/daily-mission";
}

export function toBadgeTitle(key = "") {
  return String(key)
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

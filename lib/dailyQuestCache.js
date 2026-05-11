import { getCached, setCached, invalidateCache } from "@/lib/clientCache";

const DAILY_QUEST_EVENT = "nakhlah:daily-quest-status-changed";
const DAILY_QUEST_BUNDLE_CACHE_PREFIX = "daily_quest_bundle_";
const DAILY_QUEST_BUNDLE_TTL = 5 * 60 * 1000;

export function getDailyQuestUserKey(session) {
    return session?.user?.id || session?.user?.email || "guest";
}

export function getDailyQuestBundleCacheKey(userKey) {
    return `${DAILY_QUEST_BUNDLE_CACHE_PREFIX}${userKey || "guest"}`;
}

export function getCachedDailyQuestBundle(userKey) {
    return getCached(getDailyQuestBundleCacheKey(userKey));
}

export function setCachedDailyQuestBundle(
    userKey,
    bundle,
    ttlMs = DAILY_QUEST_BUNDLE_TTL,
) {
    setCached(getDailyQuestBundleCacheKey(userKey), bundle, ttlMs);
}

export function invalidateDailyQuestBundle(userKey) {
    if (userKey) {
        invalidateCache(getDailyQuestBundleCacheKey(userKey));
    } else {
        invalidateCache(`${DAILY_QUEST_BUNDLE_CACHE_PREFIX}*`);
    }

    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new CustomEvent(DAILY_QUEST_EVENT, {
                detail: { userKey: userKey || null, at: Date.now() },
            }),
        );
    }
}

export function onDailyQuestStatusChanged(callback) {
    if (typeof window === "undefined") return () => { };

    const handler = (event) => callback(event);
    window.addEventListener(DAILY_QUEST_EVENT, handler);

    return () => {
        window.removeEventListener(DAILY_QUEST_EVENT, handler);
    };
}

/**
 * Module-level in-memory cache with TTL support.
 * Lives as long as the JS module is loaded (i.e. the full SPA session).
 * A full page reload clears it automatically — no stale data risk.
 *
 * This is a lightweight bridge until Zustand is introduced.
 */

const cache = new Map();

/**
 * Retrieve a cached value. Returns `null` if missing or expired.
 * @param {string} key
 * @returns {* | null}
 */
export function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.value;
}

/**
 * Store a value with a TTL (default 2 minutes).
 * @param {string} key
 * @param {*} value
 * @param {number} ttlMs
 */
export function setCached(key, value, ttlMs = 120_000) {
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/**
 * Delete a specific key or all keys that start with a prefix when the key
 * ends with `*` (e.g. `invalidateCache("journey*")`).
 * @param {string} keyOrPrefix
 */
export function invalidateCache(keyOrPrefix) {
    if (keyOrPrefix.endsWith("*")) {
        const prefix = keyOrPrefix.slice(0, -1);
        for (const k of cache.keys()) {
            if (k.startsWith(prefix)) cache.delete(k);
        }
    } else {
        cache.delete(keyOrPrefix);
    }
}

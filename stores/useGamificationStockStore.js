import { create } from "zustand";
import { createCachedSlice } from "./_utils/createCachedSlice";
import { fetchGamificationStocks } from "@/services/api";
import {
    DEFAULT_MAX_PALM_STOCK,
    clampPalmStock,
    getPalmRefillState,
    isPalmRefillDue,
} from "@/lib/gamification";

/**
 * Gamification Stock Store
 * Dedicated store for Palm Trees / Dates / Injaz stock, backed by
 * GET /api/user-profile/gamification-stocks (NOT the user profile document).
 * TTL: 1 minute (stock changes frequently during lessons).
 * A palm below max also bypasses that TTL once `palmUpdatedAt` is an hour old,
 * because the server applies the refill only when this endpoint is requested.
 */
const GAMIFICATION_STOCK_TTL_MS = 60 * 1000;
const REFILL_DUE_RETRY_MS = 15 * 1000;

const initialStockState = {
    userKey: null,
    palmStock: DEFAULT_MAX_PALM_STOCK,
    palmUpdatedAt: null,
    dateStock: 0,
    injazStock: 0,
    maxPalmStock: DEFAULT_MAX_PALM_STOCK,
};

let refillTimer = null;
let scheduledAuth = null;
let visibilityBound = false;
let lastDueFetchAt = 0;
let dueFetchInFlight = null;

function clearRefillTimer() {
    if (refillTimer != null) {
        clearTimeout(refillTimer);
        refillTimer = null;
    }
}

function armRefillTimer(delayMs, run) {
    clearRefillTimer();
    refillTimer = setTimeout(() => {
        refillTimer = null;
        run();
    }, Math.max(0, delayMs));
}

async function requestDuePalmRefresh() {
    const auth = scheduledAuth;
    if (!auth?.token) return null;
    if (dueFetchInFlight) return dueFetchInFlight;

    const now = Date.now();
    if (now - lastDueFetchAt < REFILL_DUE_RETRY_MS) {
        armRefillTimer(REFILL_DUE_RETRY_MS - (now - lastDueFetchAt), () => {
            void requestDuePalmRefresh();
        });
        return null;
    }

    lastDueFetchAt = now;
    dueFetchInFlight = useGamificationStockStore
        .getState()
        .fetchGamificationStock({
            token: auth.token,
            userKey: auth.userKey,
            forceRefresh: true,
        })
        .finally(() => {
            dueFetchInFlight = null;
        });

    return dueFetchInFlight;
}

function bindRefillVisibility() {
    if (visibilityBound || typeof document === "undefined") return;
    visibilityBound = true;
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState !== "visible" || !scheduledAuth?.token) return;
        useGamificationStockStore.getState().schedulePalmRefillRefresh(scheduledAuth);
    });
}

export const useGamificationStockStore = create((set, get) => ({
    ...createCachedSlice(GAMIFICATION_STOCK_TTL_MS),
    ...initialStockState,

    fetchGamificationStock: async ({ token, userKey = "guest", forceRefresh = false } = {}) => {
        if (!token) {
            set({ isLoading: false });
            return { success: false, error: "Authentication required" };
        }

        const state = get();
        const switchedUser = state.userKey !== userKey;
        const refillDue =
            !switchedUser &&
            isPalmRefillDue(state.palmUpdatedAt, state.palmStock, state.maxPalmStock);
        const shouldFetch =
            forceRefresh ||
            switchedUser ||
            refillDue ||
            state.shouldRefetch(state.lastFetchedAt);

        if (!shouldFetch) {
            get().schedulePalmRefillRefresh({ token, userKey });
            return {
                success: true,
                fromCache: true,
                palmStock: state.palmStock,
                palmUpdatedAt: state.palmUpdatedAt,
                dateStock: state.dateStock,
                injazStock: state.injazStock,
            };
        }

        if (refillDue) {
            lastDueFetchAt = Date.now();
        }

        set({ isLoading: true, error: null });

        const result = await fetchGamificationStocks(token);

        if (!result?.success) {
            set({
                isLoading: false,
                error: result?.error || "Failed to load stocks",
            });
            get().schedulePalmRefillRefresh({ token, userKey });
            return { success: false, error: result?.error || "Failed to load stocks" };
        }

        const maxPalmStock = get().maxPalmStock || DEFAULT_MAX_PALM_STOCK;
        const palmStock =
            clampPalmStock(result?.data?.palmStock?.palmStock, maxPalmStock) ??
            DEFAULT_MAX_PALM_STOCK;
        const palmUpdatedAt = result?.data?.palmStock?.palmUpdatedAt || null;
        const dateStock = Number(result?.data?.dateStock) || 0;
        const injazStock = Number(result?.data?.injazStock) || 0;

        set({
            userKey,
            palmStock,
            palmUpdatedAt,
            dateStock,
            injazStock,
            maxPalmStock,
            isLoading: false,
            error: null,
            lastFetchedAt: Date.now(),
        });

        if (isPalmRefillDue(palmUpdatedAt, palmStock, maxPalmStock)) {
            lastDueFetchAt = Date.now();
        }

        get().schedulePalmRefillRefresh({ token, userKey });

        return {
            success: true,
            fromCache: false,
            palmStock,
            palmUpdatedAt,
            dateStock,
            injazStock,
        };
    },

    /**
     * One shared timer for every mounted view. Asks for stocks when the
     * current hour elapses, or sooner if that moment already passed.
     * Does not add a palm locally.
     */
    schedulePalmRefillRefresh: ({ token, userKey = "guest" } = {}) => {
        if (!token) return;

        scheduledAuth = { token, userKey };
        bindRefillVisibility();
        clearRefillTimer();

        const { palmStock, palmUpdatedAt, maxPalmStock } = get();
        const refill = getPalmRefillState(palmUpdatedAt, palmStock, maxPalmStock);
        if (refill.isFull || refill.msRemaining == null) return;

        if (refill.msRemaining <= 0) {
            const sinceDueFetch = Date.now() - lastDueFetchAt;
            const wait =
                lastDueFetchAt > 0 && sinceDueFetch < REFILL_DUE_RETRY_MS
                    ? REFILL_DUE_RETRY_MS - sinceDueFetch
                    : 0;
            armRefillTimer(wait, () => {
                void requestDuePalmRefresh();
            });
            return;
        }

        armRefillTimer(refill.msRemaining, () => {
            void requestDuePalmRefresh();
        });
    },

    /**
     * Local palm count update after an action that already changed stock on
     * the server (for example a wrong answer). Callers should still
     * `fetchGamificationStock({ forceRefresh: true })` to resync
     * `palmUpdatedAt`. The count is clamped to the max of 5.
     */
    setPalmStock: (palmStock, palmUpdatedAt) => {
        set((state) => ({
            palmStock:
                clampPalmStock(palmStock, state.maxPalmStock) ?? state.palmStock,
            palmUpdatedAt:
                palmUpdatedAt !== undefined ? palmUpdatedAt : state.palmUpdatedAt,
        }));

        if (scheduledAuth?.token) {
            get().schedulePalmRefillRefresh(scheduledAuth);
        }
    },

    invalidate: () => {
        set({ lastFetchedAt: null, error: null });
    },

    clear: () => {
        clearRefillTimer();
        scheduledAuth = null;
        lastDueFetchAt = 0;
        set({
            ...initialStockState,
            lastFetchedAt: null,
            isLoading: false,
            error: null,
        });
    },
}));

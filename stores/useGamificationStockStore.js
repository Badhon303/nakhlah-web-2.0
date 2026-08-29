import { create } from "zustand";
import { createCachedSlice } from "./_utils/createCachedSlice";
import { fetchGamificationStocks } from "@/services/api";
import { DEFAULT_MAX_PALM_STOCK } from "@/lib/gamification";

/**
 * Gamification Stock Store
 * Dedicated store for Palm Trees / Dates / Injaz stock, backed by
 * GET /api/user-profile/gamification-stocks (NOT the user profile document).
 * TTL: 1 minute (stock changes frequently during lessons).
 */
const GAMIFICATION_STOCK_TTL_MS = 60 * 1000;

const initialStockState = {
    userKey: null,
    palmStock: DEFAULT_MAX_PALM_STOCK,
    palmUpdatedAt: null,
    dateStock: 0,
    injazStock: 0,
    maxPalmStock: DEFAULT_MAX_PALM_STOCK,
};

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
        const shouldFetch =
            forceRefresh ||
            switchedUser ||
            state.shouldRefetch(state.lastFetchedAt);

        if (!shouldFetch) {
            return {
                success: true,
                fromCache: true,
                palmStock: state.palmStock,
                palmUpdatedAt: state.palmUpdatedAt,
                dateStock: state.dateStock,
                injazStock: state.injazStock,
            };
        }

        set({ isLoading: true, error: null });

        const result = await fetchGamificationStocks(token);

        if (!result?.success) {
            set({
                isLoading: false,
                error: result?.error || "Failed to load stocks",
            });
            return { success: false, error: result?.error || "Failed to load stocks" };
        }

        const palmStockValue = Number(result?.data?.palmStock?.palmStock);
        const palmStock = Number.isFinite(palmStockValue)
            ? palmStockValue
            : DEFAULT_MAX_PALM_STOCK;
        const palmUpdatedAt = result?.data?.palmStock?.palmUpdatedAt || null;
        const dateStock = Number(result?.data?.dateStock) || 0;
        const injazStock = Number(result?.data?.injazStock) || 0;

        set({
            userKey,
            palmStock,
            palmUpdatedAt,
            dateStock,
            injazStock,
            isLoading: false,
            error: null,
            lastFetchedAt: Date.now(),
        });

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
     * Optimistic local update used right after an action changes the palm
     * count (e.g. a wrong answer). Callers should still trigger a
     * `fetchGamificationStock({ forceRefresh: true })` shortly after to
     * resync `palmUpdatedAt` from the server for accurate refill countdowns.
     */
    setPalmStock: (palmStock, palmUpdatedAt) => {
        set((state) => ({
            palmStock: Number.isFinite(Number(palmStock))
                ? Number(palmStock)
                : state.palmStock,
            palmUpdatedAt:
                palmUpdatedAt !== undefined ? palmUpdatedAt : state.palmUpdatedAt,
        }));
    },

    invalidate: () => {
        set({ lastFetchedAt: null, error: null });
    },

    clear: () => {
        set({
            ...initialStockState,
            lastFetchedAt: null,
            isLoading: false,
            error: null,
        });
    },
}));

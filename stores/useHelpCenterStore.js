import { create } from "zustand";
import { createCachedSlice } from "./_utils/createCachedSlice";
import { fetchHelpCenter as fetchHelpCenterApi } from "@/services/api/globals";

/**
 * Help Center Store
 * Caches the full Help Center globals doc (FAQ, policies, learning tips).
 * This content is managed via CMS and rarely changes, so the whole document
 * is fetched once and reused instantly by the standalone policy and help
 * center screens instead of each screen re-fetching its own slice.
 * TTL: 30 minutes
 */
const HELP_CENTER_TTL_MS = 30 * 60 * 1000;

export const useHelpCenterStore = create((set, get) => ({
    ...createCachedSlice(HELP_CENTER_TTL_MS),

    data: null,

    fetchHelpCenter: async (token, { forceRefresh = false } = {}) => {
        const state = get();
        const shouldFetch = forceRefresh || state.shouldRefetch(state.lastFetchedAt);

        if (!shouldFetch && state.data) {
            return { success: true, fromCache: true, data: state.data };
        }

        set({ isLoading: true, error: null });

        const result = await fetchHelpCenterApi({}, token);
        if (!result?.success) {
            set({ isLoading: false, error: result?.error || "Failed to load help center content" });
            return { success: false, error: result?.error || "Failed to load help center content" };
        }

        set({
            data: result.data,
            isLoading: false,
            error: null,
            lastFetchedAt: Date.now(),
        });

        return { success: true, fromCache: false, data: result.data };
    },

    invalidate: () => {
        set({ lastFetchedAt: null, error: null });
    },

    clear: () => {
        set({ data: null, lastFetchedAt: null, isLoading: false, error: null });
    },
}));

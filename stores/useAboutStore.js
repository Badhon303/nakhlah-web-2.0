import { create } from "zustand";
import { createCachedSlice } from "./_utils/createCachedSlice";
import { fetchAbout as fetchAboutApi } from "@/services/api/globals";

/**
 * About Nakhlah Store
 * Caches the "About" globals doc (about, job vacancy, fees, developers,
 * partners, website URL, etc). This content is managed via CMS and rarely
 * changes, so once fetched it's reused instantly across the standalone
 * /about route and the in-app profile "About Nakhlah" screen instead of
 * re-fetching on every visit.
 * TTL: 30 minutes
 */
const ABOUT_TTL_MS = 30 * 60 * 1000;

export const useAboutStore = create((set, get) => ({
    ...createCachedSlice(ABOUT_TTL_MS),

    data: null,

    fetchAbout: async (token, { forceRefresh = false } = {}) => {
        const state = get();
        const shouldFetch = forceRefresh || state.shouldRefetch(state.lastFetchedAt);

        if (!shouldFetch && state.data) {
            return { success: true, fromCache: true, data: state.data };
        }

        set({ isLoading: true, error: null });

        const result = await fetchAboutApi(token);
        if (!result?.success) {
            set({ isLoading: false, error: result?.error || "Failed to load about content" });
            return { success: false, error: result?.error || "Failed to load about content" };
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

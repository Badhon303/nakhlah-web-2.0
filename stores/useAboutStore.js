import { create } from "zustand";
import { createCachedSlice } from "./_utils/createCachedSlice";
import { fetchAbout as fetchAboutApi } from "@/services/api/globals";

const ABOUT_TTL_MS = 30 * 60 * 1000;

export const useAboutStore = create((set, get) => ({
    ...createCachedSlice(ABOUT_TTL_MS),

    data: null,

    fetchAbout: async ({ forceRefresh = false } = {}) => {
        const state = get();
        const shouldFetch = forceRefresh || state.shouldRefetch(state.lastFetchedAt);

        if (!shouldFetch && state.data) {
            return { success: true, fromCache: true, data: state.data };
        }

        set({ isLoading: true, error: null });

        const result = await fetchAboutApi();
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

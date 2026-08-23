import { create } from "zustand";
import { createCachedSlice } from "./_utils/createCachedSlice";
import { fetchUserOnboardingGlobals } from "@/services/api/auth";

/**
 * Onboarding Globals Store
 * Caches the onboarding option lists (proficiency, goals, purposes,
 * countries, sources, interests, ages, etc). This content is managed via
 * CMS and rarely changes, so it's fetched once per session and reused
 * instantly by both the onboarding flow and the "Edit Profile" screen
 * (which reuses the same select options), instead of each fetching it
 * independently.
 * TTL: 30 minutes
 */
const ONBOARDING_GLOBALS_TTL_MS = 30 * 60 * 1000;

export const useOnboardingGlobalsStore = create((set, get) => ({
    ...createCachedSlice(ONBOARDING_GLOBALS_TTL_MS),

    data: null,

    // `resolveFallbackToken`, when provided, is only invoked if the initial
    // (tokenless) request fails, mirroring the original onboarding page
    // behavior of avoiding an extra session lookup unless needed.
    fetchOnboardingGlobals: async ({ forceRefresh = false, resolveFallbackToken } = {}) => {
        const state = get();
        const shouldFetch = forceRefresh || state.shouldRefetch(state.lastFetchedAt);

        if (!shouldFetch && state.data) {
            return { success: true, fromCache: true, data: state.data };
        }

        set({ isLoading: true, error: null });

        let result = await fetchUserOnboardingGlobals();

        if (!result.success && typeof resolveFallbackToken === "function") {
            const token = await resolveFallbackToken();
            if (token) {
                result = await fetchUserOnboardingGlobals(token);
            }
        }

        if (!result?.success || !result.data) {
            set({ isLoading: false, error: result?.error || "Failed to load onboarding data" });
            return { success: false, error: result?.error || "Failed to load onboarding data" };
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

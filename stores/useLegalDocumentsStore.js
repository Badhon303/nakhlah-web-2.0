import { create } from "zustand";
import { createCachedSlice } from "./_utils/createCachedSlice";
import { fetchLegalDocuments as fetchLegalDocumentsApi } from "@/services/api/globals";

/**
 * Legal Documents Store
 * Caches the full Legal Documents globals doc (Terms & Conditions, Privacy
 * Policy). This content is managed via CMS and rarely changes, so the whole
 * document is fetched once and reused instantly by the standalone
 * /terms-and-conditions and /privacy routes plus the in-app profile
 * equivalents, instead of each screen re-fetching its own slice.
 * TTL: 30 minutes
 */
const LEGAL_DOCUMENTS_TTL_MS = 30 * 60 * 1000;

export const useLegalDocumentsStore = create((set, get) => ({
    ...createCachedSlice(LEGAL_DOCUMENTS_TTL_MS),

    data: null,

    fetchLegalDocuments: async (token, { forceRefresh = false } = {}) => {
        const state = get();
        const shouldFetch = forceRefresh || state.shouldRefetch(state.lastFetchedAt);

        if (!shouldFetch && state.data) {
            return { success: true, fromCache: true, data: state.data };
        }

        set({ isLoading: true, error: null });

        const result = await fetchLegalDocumentsApi({}, token);
        if (!result?.success) {
            set({ isLoading: false, error: result?.error || "Failed to load legal documents" });
            return { success: false, error: result?.error || "Failed to load legal documents" };
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

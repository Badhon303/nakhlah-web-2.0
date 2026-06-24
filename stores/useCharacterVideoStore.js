import { create } from "zustand";
import { getCharacterVideo } from "@/lib/characterVideos";

const GATE_IMAGE_SRC = "/gate.svg";

async function fetchBlobUrl(url, fallback) {
    try {
        const response = await fetch(url);
        if (!response.ok) return fallback;
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch {
        return fallback;
    }
}

/**
 * Prefetches character animation videos and the gate banner image as blob URLs
 * so they render instantly. Call prefetchAll() once at app startup (ClientWrapper).
 */
export const useCharacterVideoStore = create((set, get) => ({
    blobUrls: {},
    gateBlobUrl: null,
    prefetched: false,

    prefetchAll: async () => {
        if (get().prefetched) return;

        const keys = ["happy", "sad"];
        const [videoEntries, gateUrl] = await Promise.all([
            Promise.all(
                keys.map(async (key) => [
                    key,
                    await fetchBlobUrl(getCharacterVideo(key), getCharacterVideo(key)),
                ]),
            ),
            fetchBlobUrl(GATE_IMAGE_SRC, GATE_IMAGE_SRC),
        ]);

        set({
            blobUrls: Object.fromEntries(videoEntries),
            gateBlobUrl: gateUrl,
            prefetched: true,
        });
    },

    getVideoSrc: (key) => {
        const { blobUrls } = get();
        return blobUrls[key] || getCharacterVideo(key);
    },

    getGateSrc: () => {
        const { gateBlobUrl } = get();
        return gateBlobUrl || GATE_IMAGE_SRC;
    },
}));

/**
 * Convenience hook — returns the prefetched blob URL for a given key,
 * or falls back to the remote Cloudinary URL if not yet prefetched.
 */
export function useCharacterVideo(key) {
    return useCharacterVideoStore((s) => s.getVideoSrc(key));
}

export function useGateImage() {
    return useCharacterVideoStore((s) => s.getGateSrc());
}

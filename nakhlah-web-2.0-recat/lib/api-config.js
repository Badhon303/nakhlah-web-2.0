const BUILD_TIME_URL = process.env.NEXT_PUBLIC_API_URL || "";

function detectApiBaseUrl() {
    if (typeof window === "undefined") return BUILD_TIME_URL;

    try {
        const stored = localStorage.getItem("nakhlah:api-base-url");
        if (stored) return stored;
    } catch {}

    if (BUILD_TIME_URL && !/^localhost$/i.test(BUILD_TIME_URL)) {
        return BUILD_TIME_URL;
    }

    const isCapacitor =
        window.Capacitor?.isNativePlatform?.() ||
        window.location.protocol === "capacitor:" ||
        window.location.protocol === "file:";

    if (isCapacitor && BUILD_TIME_URL) {
        return BUILD_TIME_URL.replace(/^https?:\/\/localhost/, window.location.origin);
    }

    return BUILD_TIME_URL;
}

export const API_BASE_URL = detectApiBaseUrl();

export function setApiBaseUrl(url) {
    if (typeof window === "undefined") return;
    try {
        if (url) {
            localStorage.setItem("nakhlah:api-base-url", url);
        } else {
            localStorage.removeItem("nakhlah:api-base-url");
        }
    } catch {}
}

export const buildApiUrl = (path = "") => {
    const baseUrl = detectApiUrl();

    if (!path) return baseUrl;

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    if (!baseUrl) {
        return path;
    }

    const normalizedBase = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
};

function detectApiUrl() {
    if (typeof window === "undefined") return BUILD_TIME_URL;

    try {
        const stored = localStorage.getItem("nakhlah:api-base-url");
        if (stored) return stored;
    } catch {}

    return BUILD_TIME_URL;
}
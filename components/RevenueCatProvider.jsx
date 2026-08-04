"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useSession } from "@/lib/auth-client";
import {
    initRevenueCat,
    loginRevenueCat,
    logoutRevenueCat,
    getCustomerInfo,
    ENTITLEMENT_ID,
} from "@/lib/revenuecat";

const RevenueCatContext = createContext(null);

export function RevenueCatProvider({ children }) {
    const { data: session, status } = useSession();
    const [ready, setReady] = useState(false);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const lastUserIdRef = useRef(null);

    const userId = session?.user?.id || null;

    const refresh = useCallback(async () => {
        const info = await getCustomerInfo();
        setCustomerInfo(info);
        return info;
    }, []);

    // Configure once on mount.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const ok = await initRevenueCat(userId);
            if (cancelled) return;
            setReady(Boolean(ok));
            if (ok) {
                lastUserIdRef.current = userId;
                await refresh();
            }
            setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // React to auth changes: log in / out of RevenueCat.
    useEffect(() => {
        if (!ready) return;
        if (status === "loading") return;
        if (userId === lastUserIdRef.current) return;

        (async () => {
            setLoading(true);
            if (userId) {
                await loginRevenueCat(userId);
            } else {
                await logoutRevenueCat();
            }
            lastUserIdRef.current = userId;
            await refresh();
            setLoading(false);
        })();
    }, [userId, status, ready, refresh]);

    const isPremium = Boolean(
        customerInfo?.activeEntitlementIds?.includes(ENTITLEMENT_ID),
    );

    const value = useMemo(
        () => ({
            ready,
            loading,
            customerInfo,
            isPremium,
            entitlementId: ENTITLEMENT_ID,
            refresh,
        }),
        [ready, loading, customerInfo, isPremium, refresh],
    );

    return (
        <RevenueCatContext.Provider value={value}>
            {children}
        </RevenueCatContext.Provider>
    );
}

export function useRevenueCat() {
    const ctx = useContext(RevenueCatContext);
    if (!ctx) {
        return {
            ready: false,
            loading: false,
            customerInfo: null,
            isPremium: false,
            entitlementId: ENTITLEMENT_ID,
            refresh: async () => null,
        };
    }
    return ctx;
}

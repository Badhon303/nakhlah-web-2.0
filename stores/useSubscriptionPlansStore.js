import { create } from "zustand";
import { createCachedSlice } from "./_utils/createCachedSlice";
import { fetchSubscriptionPlans as fetchSubscriptionPlansApi } from "@/services/api";
import {
    getPackages,
    getSubscriptionOfferingId,
    isNativePlatform,
} from "@/lib/revenuecat";
import { resolveSubscriptionPackage } from "@/services/revenuecat-checkout";

/**
 * Subscription Plans Store
 * Manages premium subscription plans from the API
 * TTL: 5 minutes
 * Persistence: Yes (read-only pricing data, safe to cache)
 */
const SUBSCRIPTION_PLANS_TTL_MS = 5 * 60 * 1000;

const formatPlanPrice = (price, interval) => {
    const symbol = "$";
    const suffix = interval === "year" ? "/yr" : interval === "month" ? "/mo" : "";
    return `${symbol}${price}${suffix}`;
};

const mapSubscriptionPlan = (
    item,
    index,
    storePackage = null,
    native = false,
) => {
    const interval = item?.interval;
    const isYearly = interval === "year";
    const price = item?.price ?? 0;

    return {
        id: item?.id || `subscription-plan-${index}`,
        duration: item?.name || (isYearly ? "Yearly" : "Monthly"),
        interval,
        // Native store prices are already localized by Google Play / App Store.
        // Never show the API's USD amount beside a localized native checkout.
        price: native
            ? (storePackage?.priceString || null)
            : formatPlanPrice(price, interval),
        actualPrice: null,
        savePercent: null,
        popular: isYearly,
        paypalPlanId: item?.paypalPlanId || "",
        isActive: item?.isActive !== false,
        raw: item,
    };
};

export const useSubscriptionPlansStore = create((set, get) => ({
    ...createCachedSlice(SUBSCRIPTION_PLANS_TTL_MS),

    plans: [],

    fetchSubscriptionPlans: async ({ forceRefresh = false } = {}) => {
        const state = get();
        const shouldFetch = forceRefresh || state.shouldRefetch(state.lastFetchedAt);

        if (!shouldFetch && state.plans.length) {
            return { success: true, fromCache: true, plans: state.plans };
        }

        set({ isLoading: true, error: null });

        const result = await fetchSubscriptionPlansApi();
        if (!result?.success) {
            set({
                isLoading: false,
                error: result?.error || "Failed to load subscription plans",
            });
            return {
                success: false,
                error: result?.error || "Failed to load subscription plans",
            };
        }

        const activePlans = (result.plans || []).filter(
            (item) => item?.isActive !== false,
        );
        const native = isNativePlatform();
        let storePackages = [];
        if (native) {
            const offering = await getPackages(getSubscriptionOfferingId());
            if (offering.success) storePackages = offering.packages;
        }

        const plans = activePlans
            .map((item, index) => {
                const storePlan = { ...item, interval: item?.interval, raw: item };
                const storePackage = native
                    ? resolveSubscriptionPackage(storePackages, storePlan)
                    : null;
                return mapSubscriptionPlan(item, index, storePackage, native);
            })
            .sort((a, b) => (a.interval === "year" ? 1 : -1));

        set({
            plans,
            isLoading: false,
            error: null,
            lastFetchedAt: Date.now(),
        });

        return { success: true, fromCache: false, plans };
    },

    invalidate: () => {
        set({ lastFetchedAt: null, error: null });
    },

    clear: () => {
        set({ plans: [], lastFetchedAt: null, isLoading: false, error: null });
    },
}));

// Bridges the app's existing plan / date-package objects to RevenueCat packages.
//
// Mapping strategy (first match wins):
//   1. Explicit RevenueCat package identifier on the backend item
//      (raw.rcPackageId / raw.revenueCatPackageId)
//   2. Explicit RevenueCat product id (raw.rcProductId / raw.revenueCatProductId)
//   3. Heuristic fallback:
//        - subscriptions: interval (month/year) -> packageType (MONTHLY/ANNUAL)
//        - dates: match by date amount encoded in product id, else by order
//
// Configure real product ids in the RevenueCat dashboard and, ideally, return an
// `rcPackageId` from your API so the mapping is explicit rather than heuristic.

import {
    getPackages,
    purchasePackage,
    getSubscriptionOfferingId,
    getDatesOfferingId,
} from "@/lib/revenuecat";

const DATE_PACKAGE_REVENUECAT_IDS = {
    "date-package-1": {
        packageId: "date-package-1",
        productId: "date_package_1",
        dateAmount: 500,
    },
    "date-package-2": {
        packageId: "date-package-2",
        productId: "date_package_2",
        dateAmount: 1000,
    },
    "date-package-3": {
        packageId: "date-package-3",
        productId: "date_package_3",
        dateAmount: 2500,
    },
};

const SUBSCRIPTION_REVENUECAT_IDS = {
    month: { packageId: "$rc_monthly", productId: "monthly" },
    year: { packageId: "$rc_annual", productId: "yearly" },
};

function readIdentifierHints(item) {
    const raw = item?.raw || item || {};
    const configuredHints = {
        packageId: raw.rcPackageId || raw.revenueCatPackageId || null,
        productId: raw.rcProductId || raw.revenueCatProductId || null,
    };
    const knownDateHints = DATE_PACKAGE_REVENUECAT_IDS[raw.id || item?.id];
    const knownSubscriptionHints = SUBSCRIPTION_REVENUECAT_IDS[
        raw.interval || item?.interval
    ];
    const knownHints = knownDateHints || knownSubscriptionHints;

    return {
        packageId: configuredHints.packageId || knownHints?.packageId || null,
        productId: configuredHints.productId || knownHints?.productId || null,
    };
}

function matchByHints(packages, hints) {
    if (hints.packageId) {
        const byPkg = packages.find((p) => p.identifier === hints.packageId);
        if (byPkg) return byPkg;
    }
    if (hints.productId) {
        const byProduct = packages.find((p) => p.productId === hints.productId);
        if (byProduct) return byProduct;
    }
    return null;
}

function matchSubscriptionByInterval(packages, plan) {
    const interval = plan?.interval || plan?.raw?.interval;
    const wantAnnual = interval === "year";
    const wantMonthly = interval === "month";

    // RevenueCat standard package identifiers / types.
    return (
        packages.find((p) => {
            const type = (p.packageType || "").toUpperCase();
            const id = (p.identifier || "").toLowerCase();
            if (wantAnnual) return type === "ANNUAL" || id.includes("annual") || id.includes("year");
            if (wantMonthly) return type === "MONTHLY" || id.includes("monthly") || id.includes("month");
            return false;
        }) || null
    );
}

function matchDatePackage(packages, pkg) {
    const amount = Number(pkg?.amount) || Number(pkg?.raw?.dateAmount) || null;
    const knownHints = Object.values(DATE_PACKAGE_REVENUECAT_IDS).find(
        (entry) => entry.dateAmount === amount,
    );

    if (knownHints) {
        const byKnownId = matchByHints(packages, knownHints);
        if (byKnownId) return byKnownId;
    }

    if (amount) {
        const byAmount = packages.find(
            (p) =>
                p.productId?.includes(String(amount)) ||
                p.identifier?.includes(String(amount)),
        );
        if (byAmount) return byAmount;
    }
    return null;
}

/**
 * Purchase a subscription plan through RevenueCat.
 * @returns {Promise<{success:boolean, cancelled?:boolean, customerInfo?:object, error?:string}>}
 */
export async function purchaseSubscriptionPlan(plan) {
    const { success, packages, error } = await getPackages(
        getSubscriptionOfferingId(),
    );
    if (!success) return { success: false, error };

    const hints = readIdentifierHints(plan);
    const target =
        matchByHints(packages, hints) ||
        matchSubscriptionByInterval(packages, plan) ||
        packages[0];

    if (!target) {
        return {
            success: false,
            error: "No matching RevenueCat subscription package was found.",
        };
    }

    return purchasePackage(target);
}

/**
 * Purchase a one-time date/gem package through RevenueCat.
 * @returns {Promise<{success:boolean, cancelled?:boolean, customerInfo?:object, error?:string}>}
 */
export async function purchaseDatePackage(pkg) {
    const { success, packages, error } = await getPackages(getDatesOfferingId());
    if (!success) return { success: false, error };

    const hints = readIdentifierHints(pkg);
    const target = matchByHints(packages, hints) || matchDatePackage(packages, pkg);

    if (!target) {
        return {
            success: false,
            error: "No matching RevenueCat date package was found.",
        };
    }

    return purchasePackage(target);
}

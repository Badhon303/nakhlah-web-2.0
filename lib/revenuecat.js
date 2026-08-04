// Cross-platform RevenueCat wrapper.
//
// - Native (iOS/Android) uses @revenuecat/purchases-capacitor (StoreKit / Google Play Billing).
// - Web uses @revenuecat/purchases-js (RevenueCat Web Billing, Stripe-backed).
//
// The two SDKs have different APIs and object shapes, so everything is normalized
// to a common shape here. UI code should only ever import from this module.

const ENTITLEMENT_ID = process.env.NEXT_PUBLIC_RC_ENTITLEMENT_ID || "premium";
const SUBSCRIPTION_OFFERING_ID =
    process.env.NEXT_PUBLIC_RC_SUBSCRIPTION_OFFERING_ID || "";
const DATES_OFFERING_ID = process.env.NEXT_PUBLIC_RC_DATES_OFFERING_ID || "dates";

const API_KEYS = {
    android: process.env.NEXT_PUBLIC_RC_ANDROID_API_KEY || "",
    ios: process.env.NEXT_PUBLIC_RC_IOS_API_KEY || "",
    web: process.env.NEXT_PUBLIC_RC_WEB_API_KEY || "",
};

let _configured = false;
let _configuring = null;
let _webInstance = null; // instance returned by purchases-js Purchases.configure
let _platform = null; // "ios" | "android" | "web"

function detectPlatform() {
    if (typeof window === "undefined") return "web";
    const Cap = window.Capacitor;
    if (Cap?.isNativePlatform?.()) {
        const p = Cap.getPlatform?.();
        if (p === "ios") return "ios";
        if (p === "android") return "android";
    }
    return "web";
}

export function isNativePlatform() {
    const p = _platform || detectPlatform();
    return p === "ios" || p === "android";
}

export { ENTITLEMENT_ID };

function getApiKeyForPlatform(platform) {
    if (platform === "ios") return API_KEYS.ios;
    if (platform === "android") return API_KEYS.android;
    return API_KEYS.web;
}

/**
 * Initialize/configure RevenueCat for the current platform.
 * Safe to call multiple times; only configures once.
 * @param {string|null} appUserId - your backend user id, or null for anonymous
 */
export async function initRevenueCat(appUserId = null) {
    if (_configured) return true;
    if (_configuring) return _configuring;

    _configuring = (async () => {
        _platform = detectPlatform();
        const apiKey = getApiKeyForPlatform(_platform);

        if (!apiKey) {
            console.warn(
                `[RevenueCat] Missing API key for platform "${_platform}". Set the matching NEXT_PUBLIC_RC_*_API_KEY env var.`,
            );
            _configuring = null;
            return false;
        }

        try {
            if (_platform === "ios" || _platform === "android") {
                const { Purchases, LOG_LEVEL } = await import(
                    "@revenuecat/purchases-capacitor"
                );
                try {
                    await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
                } catch {}
                await Purchases.configure({
                    apiKey,
                    ...(appUserId ? { appUserID: appUserId } : {}),
                });
            } else {
                const { Purchases } = await import("@revenuecat/purchases-js");
                _webInstance = appUserId
                    ? Purchases.configure(apiKey, appUserId)
                    : Purchases.configure(apiKey, Purchases.generateRevenueCatAnonymousAppUserId());
            }
            _configured = true;
            return true;
        } catch (error) {
            console.error("[RevenueCat] configure failed:", error);
            _configuring = null;
            return false;
        }
    })();

    return _configuring;
}

/** Associate the current RevenueCat customer with your backend user id. */
export async function loginRevenueCat(appUserId) {
    if (!appUserId) return null;
    if (!_configured) {
        await initRevenueCat(appUserId);
        return getCustomerInfo();
    }
    try {
        if (isNativePlatform()) {
            const { Purchases } = await import("@revenuecat/purchases-capacitor");
            const { customerInfo } = await Purchases.logIn({ appUserID: appUserId });
            return normalizeCustomerInfo(customerInfo);
        }
        if (_webInstance?.changeUser) {
            const info = await _webInstance.changeUser(appUserId);
            return normalizeCustomerInfo(info);
        }
        return getCustomerInfo();
    } catch (error) {
        console.error("[RevenueCat] logIn failed:", error);
        return null;
    }
}

/** Reset to an anonymous customer (call on sign-out). */
export async function logoutRevenueCat() {
    if (!_configured) return;
    try {
        if (isNativePlatform()) {
            const { Purchases } = await import("@revenuecat/purchases-capacitor");
            await Purchases.logOut();
        }
        // purchases-js has no logout; switching users happens via changeUser on next login.
    } catch (error) {
        console.warn("[RevenueCat] logOut failed:", error);
    }
}

function pickProductFields(pkg, platform) {
    // Native package shape: pkg.product.{ identifier, title, description, priceString, price, currencyCode }
    // Web package shape: pkg.webBillingProduct/pkg.rcBillingProduct.{ title, currentPrice: { formattedPrice, amountMicros, currency } }
    if (platform === "web") {
        const product =
            pkg.webBillingProduct || pkg.rcBillingProduct || pkg.product || {};
        const price = product.currentPrice || {};
        return {
            productId: product.identifier || pkg.identifier || "",
            title: product.title || product.displayName || "",
            description: product.description || "",
            priceString: price.formattedPrice || product.priceString || "",
            priceAmount:
                typeof price.amountMicros === "number"
                    ? price.amountMicros / 1_000_000
                    : (product.price ?? null),
            currencyCode: price.currency || product.currencyCode || "",
        };
    }
    const product = pkg.product || {};
    return {
        productId: product.identifier || "",
        title: product.title || "",
        description: product.description || "",
        priceString: product.priceString || "",
        priceAmount: typeof product.price === "number" ? product.price : null,
        currencyCode: product.currencyCode || "",
    };
}

function normalizePackage(pkg, platform, offeringId) {
    return {
        identifier: pkg.identifier,
        packageType: pkg.packageType || null,
        offeringId,
        platform,
        ...pickProductFields(pkg, platform),
        raw: pkg, // required to perform the purchase
    };
}

/**
 * Fetch a normalized list of packages for a given offering.
 * @param {string} offeringId - offering identifier; empty => "current" offering
 * @returns {Promise<{success:boolean, packages:Array, error?:string}>}
 */
export async function getPackages(offeringId = "") {
    if (!_configured) {
        const ok = await initRevenueCat();
        if (!ok) return { success: false, packages: [], error: "RevenueCat not configured" };
    }

    const platform = isNativePlatform() ? _platform : "web";

    try {
        let offerings;
        if (isNativePlatform()) {
            const { Purchases } = await import("@revenuecat/purchases-capacitor");
            offerings = await Purchases.getOfferings();
        } else {
            offerings = await _webInstance.getOfferings();
        }

        const offering =
            (offeringId && offerings.all?.[offeringId]) || offerings.current || null;

        if (!offering) {
            return {
                success: false,
                packages: [],
                error: offeringId
                    ? `Offering "${offeringId}" not found`
                    : "No current offering configured",
            };
        }

        const available = offering.availablePackages || [];
        const packages = available.map((p) =>
            normalizePackage(p, platform, offering.identifier),
        );
        return { success: true, packages };
    } catch (error) {
        console.error("[RevenueCat] getPackages failed:", error);
        return { success: false, packages: [], error: error.message || "Failed to load products" };
    }
}

export function getSubscriptionOfferingId() {
    return SUBSCRIPTION_OFFERING_ID;
}
export function getDatesOfferingId() {
    return DATES_OFFERING_ID;
}

/**
 * Purchase a normalized package (from getPackages).
 * @returns {Promise<{success:boolean, cancelled?:boolean, customerInfo?:object, error?:string}>}
 */
export async function purchasePackage(normalizedPackage) {
    if (!normalizedPackage?.raw) {
        return { success: false, error: "Invalid package" };
    }
    try {
        if (isNativePlatform()) {
            const { Purchases } = await import("@revenuecat/purchases-capacitor");
            const { customerInfo } = await Purchases.purchasePackage({
                aPackage: normalizedPackage.raw,
            });
            return { success: true, customerInfo: normalizeCustomerInfo(customerInfo) };
        }
        const result = await _webInstance.purchase({ rcPackage: normalizedPackage.raw });
        return {
            success: true,
            customerInfo: normalizeCustomerInfo(result?.customerInfo),
        };
    } catch (error) {
        // Both SDKs signal user cancellation differently.
        const cancelled =
            error?.code === "1" ||
            error?.userCancelled === true ||
            error?.errorCode === "UserCancelledError" ||
            /cancel/i.test(error?.message || "");
        if (cancelled) return { success: false, cancelled: true };
        console.error("[RevenueCat] purchase failed:", error);
        return { success: false, error: error?.message || "Purchase failed" };
    }
}

function normalizeCustomerInfo(customerInfo) {
    if (!customerInfo) return null;
    const activeEntitlements = customerInfo.entitlements?.active || {};
    return {
        activeEntitlementIds: Object.keys(activeEntitlements),
        entitlements: activeEntitlements,
        raw: customerInfo,
    };
}

export async function getCustomerInfo() {
    if (!_configured) {
        const ok = await initRevenueCat();
        if (!ok) return null;
    }
    try {
        if (isNativePlatform()) {
            const { Purchases } = await import("@revenuecat/purchases-capacitor");
            const { customerInfo } = await Purchases.getCustomerInfo();
            return normalizeCustomerInfo(customerInfo);
        }
        const info = await _webInstance.getCustomerInfo();
        return normalizeCustomerInfo(info);
    } catch (error) {
        console.error("[RevenueCat] getCustomerInfo failed:", error);
        return null;
    }
}

/** Returns true if the user currently holds the given entitlement. */
export async function isEntitledTo(entitlementId = ENTITLEMENT_ID) {
    const info = await getCustomerInfo();
    return Boolean(info?.activeEntitlementIds?.includes(entitlementId));
}

/** Restore purchases (mainly for iOS "Restore" button requirement). */
export async function restorePurchases() {
    if (!_configured) {
        const ok = await initRevenueCat();
        if (!ok) return null;
    }
    try {
        if (isNativePlatform()) {
            const { Purchases } = await import("@revenuecat/purchases-capacitor");
            const { customerInfo } = await Purchases.restorePurchases();
            return normalizeCustomerInfo(customerInfo);
        }
        // Web billing has no "restore"; entitlements are tied to the app user id.
        return getCustomerInfo();
    } catch (error) {
        console.error("[RevenueCat] restore failed:", error);
        return null;
    }
}

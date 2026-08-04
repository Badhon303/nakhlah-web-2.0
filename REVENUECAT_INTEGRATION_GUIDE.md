# RevenueCat Integration

## Overview

Subscription and date/gem package purchases are handled through [RevenueCat](https://www.revenuecat.com/) instead of the previous PayPal redirect flow. Purchases happen in-app on iOS and Android (StoreKit / Google Play Billing) via `@revenuecat/purchases-capacitor`, and on the web via `@revenuecat/purchases-js` (RevenueCat Web Billing, Stripe-backed). Both SDKs are wrapped behind a single, platform-agnostic API so UI code never talks to either SDK directly.

## Architecture

### 1. **RevenueCat wrapper - `lib/revenuecat.js`**

- Detects the current platform (`ios` / `android` / `web`) via `Capacitor.isNativePlatform()`.
- `initRevenueCat(appUserId)` configures the correct SDK once per session, using the API key that matches the platform.
- `getPackages(offeringId)` fetches and normalizes RevenueCat offerings/packages into one shape regardless of SDK (native `Package.product` vs web `Package.webBillingProduct`).
- `purchasePackage(normalizedPackage)` performs the purchase and normalizes success/cancellation/error results.
- `getCustomerInfo()` / `isEntitledTo()` / `restorePurchases()` expose entitlement state.
- `loginRevenueCat(appUserId)` / `logoutRevenueCat()` keep the RevenueCat customer in sync with your app's auth session.

### 2. **React context - `components/RevenueCatProvider.jsx`**

- Configures RevenueCat on mount and re-logs-in/out whenever the NextAuth session's user id changes.
- Exposes `useRevenueCat()` → `{ ready, loading, customerInfo, isPremium, entitlementId, refresh }`.
- Scoped to the store section via `app/(dashboard)/store/layout.jsx` so it only initializes when a user visits the store.

### 3. **Checkout bridge - `services/revenuecat-checkout.js`**

- Maps the app's existing plan/date-package objects (from the backend catalog) to a RevenueCat package.
- Matching order: explicit `rcPackageId`/`rcProductId` on the item → heuristics (subscription interval → `MONTHLY`/`ANNUAL` package type; date package amount → product id) → first available package.
- `purchaseSubscriptionPlan(plan)` / `purchaseDatePackage(pkg)` are the only functions the UI calls to start a purchase.

### 4. **UI integration**

- `app/(dashboard)/store/StorePage.jsx`, `PremiumSubscription.jsx`, `GemsPurchase.jsx` call `purchaseSubscriptionPlan` / `purchaseDatePackage` instead of creating PayPal orders, then call `refreshEntitlements()` (from `useRevenueCat()`) and re-fetch the backend subscription record on success.
- Subscription cancellation (`cancelSubscription`) still goes through your existing backend API — RevenueCat purchases should be reconciled server-side (e.g. via [RevenueCat webhooks](https://www.revenuecat.com/docs/integrations/webhooks)) so `fetchCurrentSubscription` reflects the real entitlement state.

## Required environment variables

Add these to `.env` / `.env.local` (all are read via `NEXT_PUBLIC_*` since they're needed client-side):

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_RC_IOS_API_KEY` | RevenueCat public SDK key for the iOS app, from the RevenueCat dashboard. |
| `NEXT_PUBLIC_RC_ANDROID_API_KEY` | RevenueCat public SDK key for the Android app. |
| `NEXT_PUBLIC_RC_WEB_API_KEY` | RevenueCat Web Billing public API key (used when running in a regular browser, not the Capacitor app). |
| `NEXT_PUBLIC_RC_ENTITLEMENT_ID` | Entitlement identifier that unlocks premium features. Defaults to `premium`. |
| `NEXT_PUBLIC_RC_SUBSCRIPTION_OFFERING_ID` | Offering identifier for subscription plans. Leave empty to use the dashboard's "current" offering. |
| `NEXT_PUBLIC_RC_DATES_OFFERING_ID` | Offering identifier for date/gem packages. Defaults to `dates`. |

## RevenueCat dashboard setup (one-time)

1. Create a RevenueCat project and add an **iOS** app (App Store Connect bundle id) and an **Android** app (Google Play package name), plus a **Web Billing** app if web purchases are needed.
2. In App Store Connect / Google Play Console, create the actual subscription/in-app-purchase products (monthly/annual plans, date/gem packs) and import them into RevenueCat.
3. Create an **entitlement** (e.g. `premium`) and attach the subscription products to it.
4. Create two **offerings**: one for subscriptions (packages typed `MONTHLY` / `ANNUAL`) and one for date packages (e.g. offering id `dates`), each containing the relevant packages.
5. Optionally, have the backend catalog (`fetchSubscriptionPlans` / `fetchDatePackages`) return `rcPackageId` (or `rcProductId`) per item so the frontend mapping in `services/revenuecat-checkout.js` is explicit instead of relying on interval/amount heuristics.
6. Configure a RevenueCat → backend webhook so purchases/renewals/cancellations update your own subscription records (used by `fetchCurrentSubscription` / `cancelSubscription`).

## Native project sync

After installing/updating `@revenuecat/purchases-capacitor`, run:

```bash
npx cap sync
```

This regenerates the Android Gradle module references and the iOS `Package.swift` entry for the RevenueCat native SDK.

"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Crown,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { DatesIcon } from "@/components/icons/PublicAssetIcons";
import Confetti from "@/components/nakhlah/Confetti";
import { useSession } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { useDatePackagesStore } from "@/stores/useDatePackagesStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useSubscriptionPlansStore } from "@/stores/useSubscriptionPlansStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/nakhlah/Toast";
import { cancelSubscription, fetchCurrentSubscription } from "@/services/api";
import {
  purchaseSubscriptionPlan,
  purchaseDatePackage,
} from "@/services/revenuecat-checkout";
import { useRevenueCat } from "@/components/RevenueCatProvider";

const JOURNEY_REFRESH_FLAG_KEY = "nakhlah:journey-needs-refresh";
const premiumFeatures = [
  "Unlimited palms and uninterrupted learning",
  "Personal progress tracking and insights",
  "Advanced analytics for every learning path",
  "Priority access to new premium features",
];
const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "—";

export default function StorePage() {
  const { data: session, status: sessionStatus } = useSession();
  const { refresh: refreshEntitlements } = useRevenueCat();
  const searchParams = useSearchParams();
  const [checkoutId, setCheckoutId] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isLoadingCurrentState, setIsLoadingCurrent] = useState(true);
  const [pendingSwitchPlan, setPendingSwitchPlan] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const shouldRefetchDates = searchParams.get("refetch") === "dates";
  const datePackages = useDatePackagesStore((state) => state.packages);
  const subscriptionPlans = useSubscriptionPlansStore((state) => state.plans);
  const fetchDatePackages = useDatePackagesStore(
    (state) => state.fetchDatePackages,
  );
  const fetchSubscriptionPlans = useSubscriptionPlansStore(
    (state) => state.fetchSubscriptionPlans,
  );
  const isLoadingDates = useDatePackagesStore((state) => state.isLoading);
  const isLoadingPlans = useSubscriptionPlansStore((state) => state.isLoading);
  const datesError = useDatePackagesStore((state) => state.error);
  const isLoadingCurrent =
    sessionStatus === "loading" ||
    (isSessionValid(session) && isLoadingCurrentState);

  const loadCurrentSubscription = useCallback(
    async ({ silent } = {}) => {
      if (!isSessionValid(session)) {
        setCurrentSubscription(null);
        return null;
      }
      if (!silent) setIsLoadingCurrent(true);
      try {
        const result = await fetchCurrentSubscription(getSessionToken(session));
        if (result.success) {
          setCurrentSubscription(result.subscription);
          return result.subscription;
        }
      } catch {
        // keep existing state; toast only on explicit actions
      } finally {
        if (!silent) setIsLoadingCurrent(false);
      }
      return null;
    },
    [session],
  );

  const waitForActiveSubscription = useCallback(
    async (planId, { attempts = 6, delayMs = 1500 } = {}) => {
      for (let i = 0; i < attempts; i += 1) {
        const sub = await loadCurrentSubscription({ silent: true });
        const isActiveForPlan =
          sub &&
          sub.status !== "cancelled" &&
          (!planId || sub.plan?.id === planId);
        if (isActiveForPlan) return sub;
        if (i < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
      return null;
    },
    [loadCurrentSubscription],
  );

  useEffect(() => {
    queueMicrotask(() => {
      fetchDatePackages({ forceRefresh: shouldRefetchDates });
      fetchSubscriptionPlans({ forceRefresh: shouldRefetchDates });
      loadCurrentSubscription();
    });
  }, [
    fetchDatePackages,
    fetchSubscriptionPlans,
    loadCurrentSubscription,
    shouldRefetchDates,
  ]);

  const requireAuth = () => {
    if (!isSessionValid(session)) {
      toast.error("Please login to continue.");
      return false;
    }
    return true;
  };

  const waitForDateCredit = useCallback(
    async (previousDateStock, { attempts = 6, delayMs = 1500 } = {}) => {
      const token = getSessionToken(session);
      const userKey = getUserKey(session);
      if (!token) return false;

      const fetchProfile = useProfileStore.getState().fetchMyProfile;
      for (let i = 0; i < attempts; i += 1) {
        const result = await fetchProfile(token, true, userKey);
        const newStock = Number(result?.profile?.gamificationStock?.dateStock);
        if (Number.isFinite(newStock) && newStock > previousDateStock) {
          return true;
        }
        if (i < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
      return false;
    },
    [session],
  );

  const handleDateCheckout = async (pkg) => {
    if (!requireAuth()) return;

    const previousDateStock =
      Number(
        useProfileStore.getState().profile?.gamificationStock?.dateStock,
      ) || 0;

    setCheckoutId(`dates:${pkg.id}`);
    const result = await purchaseDatePackage(pkg);
    setCheckoutId(null);

    if (!result.success) {
      toast[result.cancelled ? "info" : "error"](
        result.cancelled
          ? "Purchase cancelled."
          : result.error || "Unable to complete purchase.",
      );
      return;
    }

    toast.success("Purchase successful!");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    await refreshEntitlements();
    await loadCurrentSubscription();

    const credited = await waitForDateCredit(previousDateStock);
    if (!credited) {
      toast.info("Purchase confirmed. Your dates may take a moment to appear.");
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(JOURNEY_REFRESH_FLAG_KEY, "true");
      window.dispatchEvent(new CustomEvent("nakhlah:journey-updated"));
    }
  };

  const startSubscriptionCheckout = async (plan) => {
    setCheckoutId(`premium:${plan.id}`);
    const result = await purchaseSubscriptionPlan(plan);
    setCheckoutId(null);
    if (!result.success) {
      toast[result.cancelled ? "info" : "error"](
        result.cancelled
          ? "Purchase cancelled."
          : result.error || "Unable to start subscription.",
      );
      return;
    }
    toast.success("Subscription activated!");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    await refreshEntitlements();
    await waitForActiveSubscription(plan.id);
  };

  const handleSubscriptionCheckout = async (plan) => {
    if (!requireAuth()) return;
    const canSwitch =
      currentSubscription && currentSubscription.status !== "cancelled";
    if (canSwitch && currentSubscription.plan?.id === plan.id) {
      toast.info(
        currentSubscription.cancelAtPeriodEnd
          ? `You can resubscribe after ${formatDate(currentSubscription.currentPeriodEnd)}.`
          : "You already have this plan.",
      );
      return;
    }
    if (canSwitch) {
      setPendingSwitchPlan(plan);
      return;
    }
    await startSubscriptionCheckout(plan);
  };

  const handleConfirmSwitch = async () => {
    if (!pendingSwitchPlan) return;
    const plan = pendingSwitchPlan;
    setPendingSwitchPlan(null);
    setIsCanceling(true);
    setCheckoutId(`premium:${plan.id}`);
    const result = await purchaseSubscriptionPlan(plan);
    setIsCanceling(false);
    setCheckoutId(null);
    if (!result.success) {
      toast[result.cancelled ? "info" : "error"](
        result.cancelled
          ? "Purchase cancelled."
          : result.error || "Failed to switch plan.",
      );
      return;
    }
    toast.success(result.message || "Plan switched successfully.");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    await refreshEntitlements();
    await waitForActiveSubscription(plan.id);
  };

  const promptCancelSubscription = () => {
    if (!requireAuth()) return;
    if (!currentSubscription?.id) {
      toast.error("No active subscription found.");
      return;
    }
    setShowConfirmCancel(true);
  };

  const confirmCancelSubscription = async () => {
    if (!requireAuth() || !currentSubscription?.id) return;
    setShowConfirmCancel(false);
    setIsCanceling(true);
    const result = await cancelSubscription(
      currentSubscription.id,
      getSessionToken(session),
    );
    setIsCanceling(false);
    if (!result.success) {
      toast.error(result.error || "Unable to cancel subscription.");
      return;
    }
    toast.success(result.message || "Subscription canceled successfully.");
    await loadCurrentSubscription();
  };

  const handleResubscribe = async (plan) => {
    if (!requireAuth()) return;
    const selectedPlan = plan || currentSubscription?.plan;
    if (!selectedPlan?.id) {
      toast.error("No plan selected.");
      return;
    }
    await startSubscriptionCheckout(selectedPlan);
  };

  const subscriptionIsActive =
    currentSubscription?.status !== "cancelled" &&
    !currentSubscription?.cancelAtPeriodEnd;
  const subscriptionIsEnding =
    currentSubscription?.status !== "cancelled" &&
    currentSubscription?.cancelAtPeriodEnd;
  const hasEndedSubscription = currentSubscription?.status === "cancelled";
  const closeSwitchDialog = () => {
    setPendingSwitchPlan(null);
    setIsCanceling(false);
    setCheckoutId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Confetti active={showConfetti} />
      <main className=" container mx-auto px-4 py-6 max-w-7xl space-y-6">
        <section className="grid min-h-24 items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            {/* <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent"><Sparkles className="h-3.5 w-3.5" /> Nakhlah Store</span> */}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Invest in your{" "}
              <span className="text-gradient-accent">learning rhythm.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Unlock a smoother path through Nakhlah, or pick up Dates whenever
              you need an extra boost.
            </p>
          </div>
          {isLoadingCurrent ? (
            <div className="flex h-24 w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 lg:w-60">
              <span className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </span>
            </div>
          ) : currentSubscription ? (
            <button
              type="button"
              onClick={() => setShowSubscriptionDetails(true)}
              className="group flex h-24 w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md lg:w-60"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Your membership
                </span>
                <span className="block truncate text-sm font-bold text-foreground">
                  {currentSubscription.plan?.name || "Premium"}
                </span>
                <span
                  className={`block text-xs font-medium ${subscriptionIsActive ? "text-emerald-600 dark:text-emerald-400" : subscriptionIsEnding ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground"}`}
                >
                  {subscriptionIsActive
                    ? "Active"
                    : subscriptionIsEnding
                      ? `Access until ${formatDate(currentSubscription.currentPeriodEnd)}`
                      : "Ended"}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : null}
        </section>

        <section
          aria-labelledby="premium-heading"
          className="rounded-3xl border border-accent/20 bg-card shadow-lg"
        >
          <div className="grid overflow-hidden lg:grid-cols-[0.93fr_1.07fr]">
            <div className="relative bg-gradient-accent p-7 text-accent-foreground sm:p-9 lg:p-10">
              <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full border-[28px] border-white/10" />
              <div className="relative">
                {/* <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">
                  <Crown className="h-3.5 w-3.5" /> Premium membership
                </span> */}
                <h2
                  id="premium-heading"
                  className="text-3xl font-extrabold leading-tight sm:text-4xl"
                >
                  Make every learning day count.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                  One membership, thoughtfully built around staying curious,
                  consistent, and moving forward.
                </p>
                <div className="mt-7 grid gap-3">
                  {premiumFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-accent">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-white/75">
                  <ShieldCheck className="h-4 w-4" /> Secure checkout · Cancel
                  whenever you need
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                    Choose your plan
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The same premium access, on your schedule.
                  </p>
                </div>
                {subscriptionPlans.length > 1 && (
                  <span className="hidden rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary sm:inline-flex">
                    Save more yearly
                  </span>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {isLoadingPlans
                  ? [...Array(2)].map((_, index) => (
                      <div
                        key={index}
                        className="h-[19rem] animate-pulse rounded-2xl border border-border bg-muted/40"
                      />
                    ))
                  : subscriptionPlans.map((plan) => {
                      const isCurrentPlan =
                        subscriptionIsActive &&
                        currentSubscription?.plan?.id === plan.id;
                      const isEndingPlan =
                        subscriptionIsEnding &&
                        currentSubscription?.plan?.id === plan.id;
                      const isEndedPlan =
                        hasEndedSubscription &&
                        currentSubscription?.plan?.id === plan.id;
                      const isBusy = checkoutId === `premium:${plan.id}`;
                      return (
                        <motion.article
                          key={plan.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 }}
                          className={`relative flex min-h-[19rem] flex-col rounded-2xl border p-5 transition-all ${plan.popular ? "border-accent bg-accent/[0.045] shadow-[0_12px_30px_-20px_hsl(var(--accent)/0.75)]" : "border-border bg-background hover:border-accent/40"}`}
                        >
                          {plan.popular && (
                            <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-foreground shadow-sm">
                              Best value
                            </span>
                          )}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-foreground">
                                {plan.duration}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Premium, billed{" "}
                                {plan.interval === "year"
                                  ? "annually"
                                  : "monthly"}
                              </p>
                            </div>
                            {(isCurrentPlan || isEndingPlan || isEndedPlan) && (
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${isCurrentPlan ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400" : isEndingPlan ? "bg-amber-500/12 text-amber-800 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}
                              >
                                {isCurrentPlan
                                  ? "Current"
                                  : isEndingPlan
                                    ? "Ending"
                                    : "Ended"}
                              </span>
                            )}
                          </div>
                          <div className="my-6 flex items-end gap-1">
                            <span className="text-4xl font-extrabold tracking-tight text-foreground">
                              {isBusy ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                              ) : (
                                plan.price?.replace(/\/(mo|yr)$/, "")
                              )}
                            </span>
                            <span className="mb-1 text-sm font-medium text-muted-foreground">
                              {plan.interval === "year" ? "/ year" : "/ month"}
                            </span>
                          </div>
                          <div className="space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 text-secondary" />{" "}
                              Full premium access
                            </p>
                            <p className="flex items-center gap-2">
                              <Check className="h-3.5 w-3.5 text-secondary" />{" "}
                              Manage from your account
                            </p>
                          </div>
                          <div className="mt-auto pt-5">
                            {isCurrentPlan || isEndingPlan || isEndedPlan ? (
                              <Button
                                variant="outline"
                                onClick={() => setShowSubscriptionDetails(true)}
                                className="w-full"
                              >
                                {isCurrentPlan
                                  ? "Manage plan"
                                  : isEndingPlan
                                    ? "View access details"
                                    : "View membership"}
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleSubscriptionCheckout(plan)}
                                disabled={
                                  checkoutId !== null || isLoadingCurrent
                                }
                                className="w-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
                              >
                                {isBusy
                                  ? "Opening checkout..."
                                  : `Choose ${plan.duration}`}
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </motion.article>
                      );
                    })}
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" /> Your subscription renews
                automatically until you cancel.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="dates-heading">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                <DatesIcon size="sm" /> Date packages
              </span>
              <h2
                id="dates-heading"
                className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
              >
                Keep your streak moving.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A one-time refill for when you want to keep learning without
                interruption.
              </p>
            </div>
            {/* <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> One-time
              secure purchase
            </span> */}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingDates ? (
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl border border-border bg-card"
                />
              ))
            ) : datePackages.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <DatesIcon size="md" className="mx-auto" />
                <p className="mt-3 font-semibold text-foreground">
                  {datesError
                    ? "We couldn't load date packages."
                    : "No date packages are available just now."}
                </p>
                <Button
                  onClick={() => fetchDatePackages({ forceRefresh: true })}
                  variant="outline"
                  className="mt-4"
                >
                  Try again
                </Button>
              </div>
            ) : (
              datePackages.map((pkg, index) => {
                const isBusy = checkoutId === `dates:${pkg.id}`;
                return (
                  <motion.article
                    key={pkg.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`relative flex min-h-60 flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${pkg.popular ? "border-secondary/55 ring-1 ring-secondary/20" : "border-border hover:border-secondary/35"}`}
                  >
                    {pkg.popular && (
                      <span className="absolute right-4 top-4 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                        Most loved
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                        <DatesIcon size="lg" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          {pkg.label}
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-foreground">
                          {pkg.amount.toLocaleString()}{" "}
                          <span className="text-sm font-semibold text-muted-foreground">
                            Dates
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-muted-foreground">
                      {pkg.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-5">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          One-time payment
                        </p>
                        <p className="text-2xl font-extrabold text-foreground">
                          {pkg.price}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleDateCheckout(pkg)}
                        disabled={checkoutId !== null}
                        className="bg-secondary font-bold text-secondary-foreground hover:bg-secondary/90"
                      >
                        {isBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Get dates <ArrowRight className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.article>
                );
              })
            )}
          </div>
        </section>
      </main>

      <Dialog
        open={showSubscriptionDetails}
        onOpenChange={setShowSubscriptionDetails}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-3xl border-border bg-card p-0 [&>button]:hidden">
          <div
            className={`relative p-6 ${subscriptionIsActive ? "bg-gradient-to-br from-emerald-500/15 via-card to-card" : subscriptionIsEnding ? "bg-gradient-to-br from-amber-400/15 via-card to-card" : "bg-gradient-to-br from-muted via-card to-card"}`}
          >
            <button
              onClick={() => setShowSubscriptionDetails(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${subscriptionIsActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : subscriptionIsEnding ? "bg-amber-500/15 text-amber-800 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${subscriptionIsActive ? "bg-emerald-500" : subscriptionIsEnding ? "bg-amber-500" : "bg-muted-foreground"}`}
              />
              {subscriptionIsActive
                ? "Active membership"
                : subscriptionIsEnding
                  ? "Ending membership"
                  : "Ended membership"}
            </span>
            <DialogTitle className="mt-4 text-2xl font-extrabold text-foreground">
              {currentSubscription?.plan?.name || "Premium"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm">
              {subscriptionIsActive
                ? `Renews ${formatDate(currentSubscription?.currentPeriodEnd)}`
                : subscriptionIsEnding
                  ? `Premium access ends ${formatDate(currentSubscription?.currentPeriodEnd)}`
                  : "Your premium membership is no longer active."}
            </DialogDescription>
          </div>
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-background p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Started
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {formatDate(currentSubscription?.currentPeriodStart)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {subscriptionIsEnding
                    ? "Access until"
                    : hasEndedSubscription
                      ? "Ended"
                      : "Renews on"}
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {formatDate(
                    currentSubscription?.currentPeriodEnd ||
                      currentSubscription?.cancelledAt,
                  )}
                </p>
              </div>
            </div>
            {subscriptionIsEnding && (
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
                Your membership stays fully active until{" "}
                <strong>
                  {formatDate(currentSubscription?.currentPeriodEnd)}
                </strong>
                . Select a plan above if you would like to continue.
              </div>
            )}
            {hasEndedSubscription && (
              <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
                Ready to come back? Pick a plan to restore unlimited learning
                and premium insights.
              </div>
            )}
            {hasEndedSubscription ? (
              <Button
                onClick={() => {
                  setShowSubscriptionDetails(false);
                  handleResubscribe(currentSubscription?.plan);
                }}
                disabled={checkoutId !== null}
                className="w-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
              >
                {checkoutId ? "Opening checkout..." : "Restore premium"}
              </Button>
            ) : subscriptionIsActive ? (
              <Button
                onClick={() => {
                  setShowSubscriptionDetails(false);
                  promptCancelSubscription();
                }}
                disabled={isCanceling}
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Manage or cancel membership
              </Button>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmCancel} onOpenChange={setShowConfirmCancel}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-3xl border-border bg-card p-0 [&>button]:hidden">
          <div className="p-6 pb-5">
            <button
              onClick={() => setShowConfirmCancel(false)}
              disabled={isCanceling}
              className="float-right rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-destructive/10 text-destructive">
              <Info className="h-5 w-5" />
            </span>
            <DialogTitle className="mt-4 text-xl font-extrabold">
              Cancel your membership?
            </DialogTitle>
            <DialogDescription className="mt-2 leading-6">
              You will retain all premium benefits until{" "}
              <strong className="text-foreground">
                {formatDate(currentSubscription?.currentPeriodEnd)}
              </strong>
              . After that, you will not be charged again.
            </DialogDescription>
          </div>
          <div className="flex flex-col gap-3 border-t border-border bg-muted/30 p-5 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowConfirmCancel(false)}
              disabled={isCanceling}
              className="flex-1"
            >
              Keep premium
            </Button>
            <Button
              onClick={confirmCancelSubscription}
              disabled={isCanceling}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCanceling ? "Canceling..." : "Confirm cancellation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!pendingSwitchPlan}
        onOpenChange={(open) => !open && closeSwitchDialog()}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-3xl border-border bg-card p-0 [&>button]:hidden">
          <div className="bg-gradient-accent p-6 text-accent-foreground">
            <button
              onClick={closeSwitchDialog}
              disabled={isCanceling}
              className="float-right rounded-full p-1.5 text-white/75 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <DialogTitle className="mt-4 text-xl font-extrabold text-white">
              Switch membership plan?
            </DialogTitle>
            <p className="mt-2 text-sm leading-6 text-white/80">
              You are moving from{" "}
              {currentSubscription?.plan?.name || "your current plan"} to{" "}
              {pendingSwitchPlan?.duration}.
            </p>
          </div>
          <div className="p-6">
            <p className="text-sm leading-6 text-muted-foreground">
              We’ll take you to secure checkout to confirm your new plan. Your
              current membership will be updated once checkout succeeds.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={closeSwitchDialog}
                disabled={isCanceling}
                className="flex-1"
              >
                Keep current
              </Button>
              <Button
                onClick={handleConfirmSwitch}
                disabled={isCanceling}
                className="flex-1 bg-accent font-bold text-accent-foreground hover:bg-accent/90"
              >
                {isCanceling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

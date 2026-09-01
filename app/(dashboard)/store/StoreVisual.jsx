"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Info,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatesIcon } from "@/components/icons/PublicAssetIcons";

const PREMIUM_FEATURES = [
  "Unlimited palms and uninterrupted learning",
  "Personal progress tracking and insights",
  "Advanced analytics for every learning path",
  "Priority access to new premium features",
];

export default function StoreVisual({
  datePackages,
  subscriptionPlans,
  isLoadingDates,
  isLoadingPlans,
  datesError,
  isLoadingCurrent,
  currentSubscription,
  checkoutId,
  subscriptionIsActive,
  subscriptionIsEnding,
  hasEndedSubscription,
  onDateCheckout,
  onSubscriptionCheckout,
  onShowSubscriptionDetails,
  onRetryDates,
}) {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-6 lg:max-w-7xl space-y-6">
      <section className="grid min-h-24 items-end gap-6 lg:grid-cols-[1fr_auto]">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Invest in your{" "}
            <span className="text-gradient-accent">learning rhythm.</span>
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg">
            Unlock a smoother path through Nakhlah, or pick up Dates whenever
            you need an extra boost.
          </p>
        </div>
        {!isLoadingCurrent && currentSubscription ? (
          <button
            type="button"
            onClick={onShowSubscriptionDetails}
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
                    ? "Ending soon"
                    : "Ended"}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-3xl border border-accent/20 bg-card shadow-lg">
        <div className="grid lg:grid-cols-[0.93fr_1.07fr]">
          <div className="relative bg-gradient-accent p-7 text-accent-foreground sm:p-9 lg:p-10">
            <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full border-[28px] border-white/10" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                Make every learning day count.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                One membership, thoughtfully built around staying curious,
                consistent, and moving forward.
              </p>
              <div className="mt-7 grid gap-3">
                {PREMIUM_FEATURES.map((feature) => (
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
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                Choose your plan
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                The same premium access, on your schedule.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {isLoadingPlans
                ? [0, 1].map((index) => (
                    <div
                      key={index}
                      className="h-[19rem] animate-pulse rounded-2xl border border-border bg-muted/40"
                    />
                  ))
                : subscriptionPlans.map((plan) => {
                    const isCurrent =
                      subscriptionIsActive &&
                      currentSubscription?.plan?.id === plan.id;
                    const isEnding =
                      subscriptionIsEnding &&
                      currentSubscription?.plan?.id === plan.id;
                    const isEnded =
                      hasEndedSubscription &&
                      currentSubscription?.plan?.id === plan.id;
                    const busy = checkoutId === `premium:${plan.id}`;
                    return (
                      <motion.article
                        key={plan.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative flex min-h-[19rem] flex-col rounded-2xl border p-5 ${plan.popular ? "border-accent bg-accent/[0.045] shadow-lg" : "border-border bg-background"}`}
                      >
                        {plan.popular ? (
                          <span className="absolute -top-3 left-5 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                            Best value
                          </span>
                        ) : null}
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
                          {isCurrent || isEnding || isEnded ? (
                            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {isCurrent
                                ? "Current"
                                : isEnding
                                  ? "Ending"
                                  : "Ended"}
                            </span>
                          ) : null}
                        </div>
                        <div className="my-6 flex items-end gap-1">
                          <span className="text-4xl font-extrabold text-foreground">
                            {busy ? (
                              <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                              plan.price?.replace(/\/(mo|yr)$/, "")
                            )}
                          </span>
                          <span className="mb-1 text-sm text-muted-foreground">
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
                          {isCurrent || isEnding || isEnded ? (
                            <Button
                              variant="outline"
                              onClick={onShowSubscriptionDetails}
                              className="w-full"
                            >
                              Manage membership{" "}
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => onSubscriptionCheckout(plan)}
                              disabled={checkoutId !== null || isLoadingCurrent}
                              className="w-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
                            >
                              {busy
                                ? "Opening checkout..."
                                : `Choose ${plan.duration}`}{" "}
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

      <section>
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
            <DatesIcon size="sm" /> Date packages
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Keep your streak moving.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A one-time refill for when you want to keep learning without
            interruption.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingDates ? (
            [0, 1, 2].map((index) => (
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
              <Button onClick={onRetryDates} variant="outline" className="mt-4">
                Try again
              </Button>
            </div>
          ) : (
            datePackages.map((pkg, index) => {
              const busy = checkoutId === `dates:${pkg.id}`;
              return (
                <motion.article
                  key={pkg.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`relative flex min-h-60 flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${pkg.popular ? "border-secondary/55 ring-1 ring-secondary/20" : "border-border"}`}
                >
                  {pkg.popular ? (
                    <span className="absolute right-4 top-4 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                      Most loved
                    </span>
                  ) : null}
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                      <DatesIcon size="lg" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        {pkg.label}
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-foreground">
                        {pkg.amount}{" "}
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
                      onClick={() => onDateCheckout(pkg)}
                      disabled={checkoutId !== null}
                      className="bg-secondary font-bold text-secondary-foreground hover:bg-secondary/90"
                    >
                      {busy ? (
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
  );
}

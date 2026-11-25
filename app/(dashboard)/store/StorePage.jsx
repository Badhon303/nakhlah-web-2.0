"use client"

import { useCallback, useEffect, useState } from "react"
import { Info, Loader2, X } from "lucide-react"
import Confetti from "@/components/nakhlah/Confetti"
import { useSession } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"
import { getSessionToken, isSessionValid } from "@/lib/authUtils"
import { getUserKey } from "@/lib/userKey"
import { useDatePackagesStore } from "@/stores/useDatePackagesStore"
import { useProfileStore } from "@/stores/useProfileStore"
import { useSubscriptionPlansStore } from "@/stores/useSubscriptionPlansStore"
import { Button } from "@/components/ui/button"
import StoreVisual from "./StoreVisual"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/nakhlah/Toast"
import { cancelSubscription, fetchCurrentSubscription } from "@/services/api"
import {
  purchaseSubscriptionPlan,
  purchaseDatePackage,
} from "@/services/revenuecat-checkout"
import { useRevenueCat } from "@/components/RevenueCatProvider"

const JOURNEY_REFRESH_FLAG_KEY = "nakhlah:journey-needs-refresh"
const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "—"

export default function StorePage() {
  const { data: session, status: sessionStatus } = useSession()
  const { refresh: refreshEntitlements } = useRevenueCat()
  const searchParams = useSearchParams()
  const [checkoutId, setCheckoutId] = useState(null)
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [isLoadingCurrentState, setIsLoadingCurrent] = useState(true)
  const [pendingSwitchPlan, setPendingSwitchPlan] = useState(null)
  const [isCanceling, setIsCanceling] = useState(false)
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const shouldRefetchDates = searchParams.get("refetch") === "dates"
  const datePackages = useDatePackagesStore((state) => state.packages)
  const subscriptionPlans = useSubscriptionPlansStore((state) => state.plans)
  const fetchDatePackages = useDatePackagesStore(
    (state) => state.fetchDatePackages,
  )
  const fetchSubscriptionPlans = useSubscriptionPlansStore(
    (state) => state.fetchSubscriptionPlans,
  )
  const isLoadingDates = useDatePackagesStore((state) => state.isLoading)
  const isLoadingPlans = useSubscriptionPlansStore((state) => state.isLoading)
  const datesError = useDatePackagesStore((state) => state.error)
  const isLoadingCurrent =
    sessionStatus === "loading" ||
    (isSessionValid(session) && isLoadingCurrentState)

  const loadCurrentSubscription = useCallback(
    async ({ silent } = {}) => {
      if (!isSessionValid(session)) {
        setCurrentSubscription(null)
        return null
      }
      if (!silent) setIsLoadingCurrent(true)
      try {
        const result = await fetchCurrentSubscription(getSessionToken(session))
        if (result.success) {
          setCurrentSubscription(result.subscription)
          return result.subscription
        }
      } catch {
        // keep existing state; toast only on explicit actions
      } finally {
        if (!silent) setIsLoadingCurrent(false)
      }
      return null
    },
    [session],
  )

  const waitForActiveSubscription = useCallback(
    async (planId, { attempts = 6, delayMs = 1500 } = {}) => {
      for (let i = 0; i < attempts; i += 1) {
        const sub = await loadCurrentSubscription({ silent: true })
        const isActiveForPlan =
          sub &&
          sub.status !== "cancelled" &&
          (!planId || sub.plan?.id === planId)
        if (isActiveForPlan) return sub
        if (i < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
      }
      return null
    },
    [loadCurrentSubscription],
  )

  useEffect(() => {
    queueMicrotask(() => {
      fetchDatePackages({ forceRefresh: shouldRefetchDates })
      fetchSubscriptionPlans({ forceRefresh: shouldRefetchDates })
      loadCurrentSubscription()
    })
  }, [
    fetchDatePackages,
    fetchSubscriptionPlans,
    loadCurrentSubscription,
    shouldRefetchDates,
  ])

  const requireAuth = () => {
    if (!isSessionValid(session)) {
      toast.error("Please login to continue.")
      return false
    }
    return true
  }

  const waitForDateCredit = useCallback(
    async (previousDateStock, { attempts = 6, delayMs = 1500 } = {}) => {
      const token = getSessionToken(session)
      const userKey = getUserKey(session)
      if (!token) return false

      const fetchProfile = useProfileStore.getState().fetchMyProfile
      for (let i = 0; i < attempts; i += 1) {
        const result = await fetchProfile(token, true, userKey)
        const newStock = Number(result?.profile?.gamificationStock?.dateStock)
        if (Number.isFinite(newStock) && newStock > previousDateStock) {
          return true
        }
        if (i < attempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
      }
      return false
    },
    [session],
  )

  const handleDateCheckout = async (pkg) => {
    if (!requireAuth()) return

    const previousDateStock =
      Number(
        useProfileStore.getState().profile?.gamificationStock?.dateStock,
      ) || 0

    setCheckoutId(`dates:${pkg.id}`)
    const result = await purchaseDatePackage(pkg)
    setCheckoutId(null)

    if (!result.success) {
      toast[result.cancelled ? "info" : "error"](
        result.cancelled
          ? "Purchase cancelled."
          : result.error || "Unable to complete purchase.",
      )
      return
    }

    toast.success("Purchase successful!")
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
    await refreshEntitlements()
    await loadCurrentSubscription()

    const credited = await waitForDateCredit(previousDateStock)
    if (!credited) {
      toast.info("Purchase confirmed. Your dates may take a moment to appear.")
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(JOURNEY_REFRESH_FLAG_KEY, "true")
      window.dispatchEvent(new CustomEvent("nakhlah:journey-updated"))
    }
  }

  const startSubscriptionCheckout = async (plan) => {
    setCheckoutId(`premium:${plan.id}`)
    const result = await purchaseSubscriptionPlan(plan)
    setCheckoutId(null)
    if (!result.success) {
      toast[result.cancelled ? "info" : "error"](
        result.cancelled
          ? "Purchase cancelled."
          : result.error || "Unable to start subscription.",
      )
      return
    }
    toast.success("Subscription activated!")
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
    await refreshEntitlements()
    await waitForActiveSubscription(plan.id)
  }

  const handleSubscriptionCheckout = async (plan) => {
    if (!requireAuth()) return
    const canSwitch =
      currentSubscription && currentSubscription.status !== "cancelled"
    if (canSwitch && currentSubscription.plan?.id === plan.id) {
      toast.info(
        currentSubscription.cancelAtPeriodEnd
          ? `You can resubscribe after ${formatDate(currentSubscription.currentPeriodEnd)}.`
          : "You already have this plan.",
      )
      return
    }
    if (canSwitch) {
      setPendingSwitchPlan(plan)
      return
    }
    await startSubscriptionCheckout(plan)
  }

  const handleConfirmSwitch = async () => {
    if (!pendingSwitchPlan) return
    const plan = pendingSwitchPlan
    setPendingSwitchPlan(null)
    setIsCanceling(true)
    setCheckoutId(`premium:${plan.id}`)
    const result = await purchaseSubscriptionPlan(plan)
    setIsCanceling(false)
    setCheckoutId(null)
    if (!result.success) {
      toast[result.cancelled ? "info" : "error"](
        result.cancelled
          ? "Purchase cancelled."
          : result.error || "Failed to switch plan.",
      )
      return
    }
    toast.success(result.message || "Plan switched successfully.")
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
    await refreshEntitlements()
    await waitForActiveSubscription(plan.id)
  }

  const promptCancelSubscription = () => {
    if (!requireAuth()) return
    if (!currentSubscription?.id) {
      toast.error("No active subscription found.")
      return
    }
    setShowConfirmCancel(true)
  }

  const confirmCancelSubscription = async () => {
    if (!requireAuth() || !currentSubscription?.id) return
    setShowConfirmCancel(false)
    setIsCanceling(true)
    const result = await cancelSubscription(
      currentSubscription.id,
      getSessionToken(session),
    )
    setIsCanceling(false)
    if (!result.success) {
      toast.error(result.error || "Unable to cancel subscription.")
      return
    }
    toast.success(result.message || "Subscription canceled successfully.")
    await loadCurrentSubscription()
  }

  const handleResubscribe = async (plan) => {
    if (!requireAuth()) return
    const selectedPlan = plan || currentSubscription?.plan
    if (!selectedPlan?.id) {
      toast.error("No plan selected.")
      return
    }
    await startSubscriptionCheckout(selectedPlan)
  }

  const subscriptionIsActive =
    currentSubscription?.status !== "cancelled" &&
    !currentSubscription?.cancelAtPeriodEnd
  const subscriptionIsEnding =
    currentSubscription?.status !== "cancelled" &&
    currentSubscription?.cancelAtPeriodEnd
  const hasEndedSubscription = currentSubscription?.status === "cancelled"
  const closeSwitchDialog = () => {
    setPendingSwitchPlan(null)
    setIsCanceling(false)
    setCheckoutId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Confetti active={showConfetti} />
      <StoreVisual
        datePackages={datePackages}
        subscriptionPlans={subscriptionPlans}
        isLoadingDates={isLoadingDates}
        isLoadingPlans={isLoadingPlans}
        datesError={datesError}
        isLoadingCurrent={isLoadingCurrent}
        currentSubscription={currentSubscription}
        checkoutId={checkoutId}
        subscriptionIsActive={subscriptionIsActive}
        subscriptionIsEnding={subscriptionIsEnding}
        hasEndedSubscription={hasEndedSubscription}
        onDateCheckout={handleDateCheckout}
        onSubscriptionCheckout={handleSubscriptionCheckout}
        onShowSubscriptionDetails={() => setShowSubscriptionDetails(true)}
        onRetryDates={() => fetchDatePackages({ forceRefresh: true })}
      />

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
                  setShowSubscriptionDetails(false)
                  handleResubscribe(currentSubscription?.plan)
                }}
                disabled={checkoutId !== null}
                className="w-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
              >
                {checkoutId ? "Opening checkout..." : "Restore premium"}
              </Button>
            ) : subscriptionIsActive ? (
              <Button
                onClick={() => {
                  setShowSubscriptionDetails(false)
                  promptCancelSubscription()
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
  )
}

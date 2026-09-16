"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Crown, Home, Loader2, ShieldCheck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { ConfettiRain } from "@/components/nakhlah/ResultVisuals";

const KIND_COPY = {
  dates: {
    pageEyebrow: "Date package checkout",
    successHeadline: (
      <>
        Dates <span className="text-gradient-accent">unlocked.</span>
      </>
    ),
    successSubline:
      "Your payment went through — your Dates balance has been topped up.",
    ctaLabel: "Buy More Dates",
    CtaIcon: ShoppingBag,
    successStoreHref: "/store?refetch=dates&payment=success",
    successTitle: "Payment successful!",
  },
  subscription: {
    pageEyebrow: "Subscription checkout",
    successHeadline: (
      <>
        Premium <span className="text-gradient-accent">activated.</span>
      </>
    ),
    successSubline:
      "Your membership is live — unlimited palms, analytics, and every premium feature.",
    ctaLabel: "View Membership",
    CtaIcon: Crown,
    successStoreHref: "/store?refetch=subscription&payment=success",
    successTitle: "Subscription active!",
  },
};

/**
 * Shared payment result screen (verifying / success / failed) used by the
 * PayPal and Tap return routes. Matches the store page signature: page header
 * with gradient-accent headline, then a large rounded card split between a
 * gradient rail and a content panel. On small screens the rail collapses into
 * a top banner and the mascot is hidden; on lg+ it sits beside the content.
 */
export default function PaymentResultView({
  status = "loading", // "loading" | "success" | "error"
  kind = "dates", // "dates" | "subscription"
  gateway = "Tap",
  message = "",
  rainSeconds = 4,
}) {
  const router = useRouter();
  const copy = KIND_COPY[kind] || KIND_COPY.dates;
  const isSuccess = status === "success";
  const isLoading = status === "loading";
  const mascotMood = status === "error" ? "sad" : "celebrating";

  const headline = isLoading ? (
    <>
      Confirming <span className="text-gradient-accent">your payment.</span>
    </>
  ) : isSuccess ? (
    copy.successHeadline
  ) : (
    <>
      Payment <span className="text-gradient-accent">needs attention.</span>
    </>
  );

  const subline = isLoading
    ? `Hang tight — we're verifying the transaction with ${gateway}.`
    : isSuccess
      ? copy.successSubline
      : "The charge didn't complete, so nothing was taken from your account.";

  const heroTitle = isLoading
    ? `Verifying with ${gateway}.`
    : isSuccess
      ? "Payment received."
      : "No charge completed.";

  const heroSubtitle = isLoading
    ? "This usually takes just a few seconds."
    : isSuccess
      ? "Everything's confirmed on our side — you're all set."
      : "You can retry the confirmation or head back to the store.";

  const statusLabel = isLoading
    ? "Verifying payment"
    : isSuccess
      ? "Payment confirmed"
      : "Payment unsuccessful";

  const statusTone = isLoading
    ? "text-accent"
    : isSuccess
      ? "text-secondary"
      : "text-destructive";

  const cardTitle = isLoading
    ? "Confirming payment"
    : isSuccess
      ? copy.successTitle
      : "Payment needs attention";

  const { CtaIcon } = copy;

  return (
    <div className="min-h-screen bg-background">
      {isSuccess && <ConfettiRain duration={rainSeconds} />}
      <main className="container mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            {copy.pageEyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg">
            {subline}
          </p>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-3xl border border-accent/20 bg-card shadow-lg"
        >
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative flex min-h-52 flex-col justify-between overflow-hidden bg-gradient-accent p-7 text-accent-foreground sm:p-9 lg:min-h-80 lg:p-10">
              <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[32px] border-white/10" />
              <div className="relative">
                <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
                  {heroTitle}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                  {heroSubtitle}
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-2 text-xs font-semibold text-white/75">
                <ShieldCheck className="h-4 w-4" /> Secure checkout · Powered by{" "}
                {gateway}
              </div>
            </div>

            <div className="grid items-center gap-7 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-10">
              <div>
                <p
                  className={`text-xs font-bold uppercase tracking-[0.16em] ${statusTone}`}
                >
                  {statusLabel}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
                  {cardTitle}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {message}
                </p>

                {isLoading ? (
                  <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                    Talking to {gateway}…
                  </div>
                ) : (
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={() =>
                        router.push(
                          isSuccess ? copy.successStoreHref : "/store",
                        )
                      }
                      variant={isSuccess ? "default" : "outline"}
                      className={
                        isSuccess
                          ? "bg-accent font-bold text-accent-foreground hover:bg-accent/90"
                          : ""
                      }
                    >
                      <CtaIcon className="mr-2 h-4 w-4" />
                      {copy.ctaLabel}
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/")}>
                      <Home className="mr-2 h-4 w-4" />
                      Go to Home
                    </Button>
                  </div>
                )}
              </div>
              <div className="hidden lg:block">
                <FreshDateMascot mood={mascotMood} size="xxl" />
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Home, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";

export default function PaymentCancelledView({
  eyebrow,
  title,
  description,
  primaryLabel,
  onPrimary,
  onHome,
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Checkout <span className="text-gradient-accent">paused.</span>
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg">
            Nothing was charged. You can return to the store whenever you are
            ready.
          </p>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-3xl border border-accent/20 bg-card shadow-lg"
        >
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative flex min-h-72 flex-col justify-between overflow-hidden bg-gradient-accent p-7 text-accent-foreground sm:p-9 lg:p-10">
              <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[32px] border-white/10" />
              <div className="relative">
                <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
                  No payment was completed.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                  Your account and current learning progress remain unchanged.
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-2 text-xs font-semibold text-white/75">
                <ShieldCheck className="h-4 w-4" /> Secure checkout · No charge
                made
              </div>
            </div>

            <div className="grid items-center gap-7 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                  Checkout canceled
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
                  {title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {description}
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={onPrimary}
                    className="bg-accent font-bold text-accent-foreground hover:bg-accent/90"
                  >
                    {primaryLabel}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={onHome}>
                    <Home className="mr-2 h-4 w-4" />
                    Go to Home
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <FreshDateMascot mood="sad" size="xxl" />
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

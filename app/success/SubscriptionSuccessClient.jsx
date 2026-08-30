"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Crown, Home, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";

const benefits = [
  "Unlimited palms and learning access",
  "Advanced learning insights",
  "Priority access to premium features",
];

export default function SubscriptionSuccessClient() {
  const router = useRouter();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_80px_-45px_hsl(var(--accent)/0.55)] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="hidden flex-col items-center justify-center bg-gradient-accent p-10 text-center text-accent-foreground lg:flex">
          <div className="rounded-full bg-white/15 p-6"><FreshDateMascot mood="celebrating" size="xxxl" /></div>
          <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em]"><Sparkles className="h-3.5 w-3.5" /> Premium unlocked</span>
          <p className="mt-3 text-sm leading-6 text-white/80">A more connected, uninterrupted Nakhlah experience is ready for you.</p>
        </div>
        <div className="p-7 sm:p-10">
          <div className="lg:hidden"><FreshDateMascot mood="celebrating" size="xl" /></div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"><Check className="h-6 w-6 stroke-[3]" /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-accent">Membership confirmed</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Welcome to Premium.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">Your membership is active and your premium benefits are ready whenever you are.</p>
          <div className="mt-7 rounded-2xl border border-border bg-background p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground"><Crown className="h-4 w-4 text-accent" /> Your benefits are ready</p>
            <ul className="mt-3 space-y-2">{benefits.map((benefit) => <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-secondary" /> {benefit}</li>)}</ul>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1 bg-accent font-bold text-accent-foreground hover:bg-accent/90" onClick={() => router.push("/")}><Home className="mr-2 h-4 w-4" /> Continue learning</Button>
            <Button variant="outline" className="flex-1" onClick={() => router.push("/store")}><ShoppingBag className="mr-2 h-4 w-4" /> View membership</Button>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

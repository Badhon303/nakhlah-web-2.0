"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { Home, ShoppingBag, Crown } from "lucide-react";
import {
  ConfettiBurst,
  ResultIconBadge,
} from "@/components/nakhlah/ResultVisuals";

export default function SubscriptionSuccessClient() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <ConfettiBurst />
      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-col items-center justify-center gap-6"
        >
          <FreshDateMascot mood="celebrating" size="xxxl" />
          <h2 className="text-2xl font-bold text-foreground text-center max-w-md">
            Welcome to Premium!
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-card border border-border rounded-3xl p-8 md:p-12 text-center shadow-sm overflow-hidden"
        >
          <div className="lg:hidden flex justify-center mb-6">
            <FreshDateMascot mood="celebrating" size="xxl" />
          </div>

          <div className="space-y-4">
            <ResultIconBadge icon={Crown} variant="success" />

            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              Subscription active!
            </h1>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Your premium subscription is now active. Enjoy unlimited palms,
              advanced analytics and all premium features.
            </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => router.push("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>

            <Button variant="outline" onClick={() => router.push("/store")}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

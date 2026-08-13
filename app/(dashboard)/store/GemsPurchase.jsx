"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { DatesIcon } from "@/components/icons/PublicAssetIcons";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import { useDatePackagesStore } from "@/stores/useDatePackagesStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { purchaseDatePackage } from "@/services/revenuecat-checkout";
import { useRevenueCat } from "@/components/RevenueCatProvider";
import { toast } from "@/components/nakhlah/Toast";
import { ArrowLeft } from "lucide-react";

const JOURNEY_REFRESH_FLAG_KEY = "nakhlah:journey-needs-refresh";

export default function GemsPurchase({ onBack }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { refresh: refreshEntitlements } = useRevenueCat();
  const [checkoutId, setCheckoutId] = useState(null);
  const fetchProfile = useProfileStore((state) => state.fetchMyProfile);

  const datePackages = useDatePackagesStore((state) => state.packages);
  const fetchDatePackages = useDatePackagesStore(
    (state) => state.fetchDatePackages,
  );
  const isLoading = useDatePackagesStore((state) => state.isLoading);

  // RevenueCat webhooks can take a few seconds to reach our backend after a
  // purchase (especially for sandbox/test-store purchases on mobile), so
  // poll the profile briefly instead of trusting a single immediate fetch.
  const waitForDateCredit = useCallback(
    async (previousDateStock, { attempts = 6, delayMs = 1500 } = {}) => {
      const token = getSessionToken(session);
      const userKey = getUserKey(session);
      if (!token) return false;

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
    [session, fetchProfile],
  );

  useEffect(() => {
    fetchDatePackages();
  }, [fetchDatePackages]);

  const requireAuth = () => {
    if (!isSessionValid(session)) {
      toast.error("Please login to continue.");
      return false;
    }
    return true;
  };

  const handlePackageSelect = async (pkg) => {
    if (!requireAuth()) return;

    const previousDateStock =
      Number(
        useProfileStore.getState().profile?.gamificationStock?.dateStock,
      ) || 0;

    setCheckoutId(pkg.id);
    const result = await purchaseDatePackage(pkg);

    if (!result.success) {
      setCheckoutId(null);
      if (result.cancelled) {
        toast.info("Purchase cancelled.");
      } else {
        toast.error(result.error || "Unable to complete purchase.");
      }
      return;
    }

    toast.success("Purchase successful!");
    await refreshEntitlements();

    const credited = await waitForDateCredit(previousDateStock);
    setCheckoutId(null);

    if (!credited) {
      toast.info("Purchase confirmed. Your dates may take a moment to appear.");
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(JOURNEY_REFRESH_FLAG_KEY, "true");
      window.dispatchEvent(new CustomEvent("nakhlah:journey-updated"));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <motion.div
        key="dates-packages"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <Button
          variant="ghost"
          onClick={() => (onBack ? onBack() : router.push("/store"))}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <DatesIcon size="lg" className="text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Purchase Dates
            </h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Choose a date package and complete your purchase securely.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {isLoading
            ? [...Array(4)].map((_, index) => (
                <div
                  key={`date-skeleton-${index}`}
                  className="rounded-2xl p-6 bg-card border border-border h-72 animate-pulse"
                />
              ))
            : datePackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl p-6 transition-all ${
                    pkg.popular
                      ? "bg-card border border-border hover:border-accent/50 scale-105 shadow-lg hover:shadow-xl"
                      : "bg-card border border-border hover:border-accent/50 hover:shadow-md"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      ⭐ POPULAR
                    </div>
                  )}

                  <div className="text-center space-y-4">
                    <div className="text-5xl">{pkg.emoji}</div>

                    <div>
                      <p className="text-3xl font-bold text-accent">
                        {pkg.amount}
                      </p>
                      <p className="text-sm text-muted-foreground">Dates</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground text-base mb-1">
                        {pkg.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="h-px bg-border" />

                    <p className="text-2xl font-bold text-foreground">
                      {pkg.price}
                    </p>

                    <Button
                      onClick={() => handlePackageSelect(pkg)}
                      disabled={checkoutId !== null}
                      className="w-full font-semibold h-10 bg-accent hover:bg-accent/90"
                    >
                      {checkoutId === pkg.id ? "Processing..." : "Buy Now"}
                    </Button>
                  </div>
                </motion.div>
              ))}
        </div>
      </motion.div>
    </div>
  );
}

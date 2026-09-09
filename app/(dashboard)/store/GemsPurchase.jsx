"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DatesIcon } from "@/components/icons/PublicAssetIcons";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { useDatePackagesStore } from "@/stores/useDatePackagesStore";
import { createDatePaymentOrder, createTapDateCharge } from "@/services/api";
import { toast } from "@/components/nakhlah/Toast";
import PaymentGatewayDialog from "@/components/nakhlah/PaymentGatewayDialog";
import { ArrowLeft } from "lucide-react";

export default function GemsPurchase({ onBack }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [checkoutId, setCheckoutId] = useState(null);
  const [pendingPackage, setPendingPackage] = useState(null);
  const [showGatewayDialog, setShowGatewayDialog] = useState(false);

  const datePackages = useDatePackagesStore((state) => state.packages);
  const fetchDatePackages = useDatePackagesStore(
    (state) => state.fetchDatePackages,
  );
  const isLoading = useDatePackagesStore((state) => state.isLoading);

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

  const handlePackageSelect = (pkg) => {
    if (!requireAuth()) return;
    setPendingPackage(pkg);
    setShowGatewayDialog(true);
  };

  const executeCheckout = async (gateway) => {
    if (!pendingPackage) return;

    setShowGatewayDialog(false);
    const pkg = pendingPackage;
    setPendingPackage(null);

    setCheckoutId(pkg.id);
    const result =
      gateway === "tap"
        ? await createTapDateCharge(pkg.id, getSessionToken(session))
        : await createDatePaymentOrder(pkg.id, getSessionToken(session));

    if (!result.success) {
      setCheckoutId(null);
      toast.error(
        result.error ||
          (gateway === "tap"
            ? "Unable to start Tap checkout."
            : "Unable to start PayPal checkout."),
      );
      return;
    }

    window.location.assign(result.approvalUrl || result.transactionUrl);
  };

  const closeGatewayDialog = () => {
    setShowGatewayDialog(false);
    setPendingPackage(null);
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
            Choose a date package and we’ll open secure checkout directly.
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
                      {checkoutId === pkg.id
                        ? "Opening checkout..."
                        : "Buy Now"}
                    </Button>
                  </div>
                </motion.div>
              ))}
        </div>
      </motion.div>
      <PaymentGatewayDialog
        open={showGatewayDialog}
        onClose={closeGatewayDialog}
        onSelect={executeCheckout}
        title="Buy Dates"
        description="Choose how you'd like to pay to continue to secure checkout."
        summary={
          pendingPackage ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {pendingPackage.amount} Dates
              </p>
              <p className="mt-1 text-3xl font-extrabold text-foreground">
                {pendingPackage.price}
              </p>
            </div>
          ) : null
        }
        disabled={checkoutId !== null}
      />
    </div>
  );
}

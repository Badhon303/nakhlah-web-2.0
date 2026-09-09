"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import {
  captureTapSubscriptionCharge,
  fetchCurrentSubscription,
} from "@/services/api";
import { toast } from "@/components/nakhlah/Toast";
import { Home, RefreshCw, PartyPopper } from "lucide-react";
import {
  ConfettiBurst,
  DriftingLeaves,
  ResultIconBadge,
} from "@/components/nakhlah/ResultVisuals";

export default function TapSubscriptionSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const hasCapturedRef = useRef(false);
  const tapId = searchParams.get("tap_id") || "";
  const [captureAttempt, setCaptureAttempt] = useState(0);
  const [captureState, setCaptureState] = useState({
    status: "loading",
    message: "Confirming your Tap subscription...",
  });

  useEffect(() => {
    if (sessionStatus === "loading" || hasCapturedRef.current) return;

    const capturePayment = async () => {
      if (!tapId) {
        setCaptureState({
          status: "error",
          message: "Missing Tap charge id. Please contact support.",
        });
        return;
      }

      if (!isSessionValid(session)) {
        setCaptureState({
          status: "error",
          message: "Please log in again so we can confirm this subscription.",
        });
        return;
      }

      hasCapturedRef.current = true;
      const result = await captureTapSubscriptionCharge(
        tapId,
        getSessionToken(session),
      );

      if (!result.success) {
        hasCapturedRef.current = false;
        setCaptureState({
          status: "error",
          message: result.error || "Unable to confirm your Tap subscription.",
        });
        toast.error(result.error || "Unable to confirm Tap subscription.");
        return;
      }

      // Refresh subscription state so the store reflects the new plan.
      await fetchCurrentSubscription(getSessionToken(session)).catch(() => {});

      setCaptureState({
        status: "success",
        message:
          result.message ||
          "Subscription confirmed successfully. Welcome to Premium!",
      });
      toast.success(result.message || "Subscription confirmed successfully.");
    };

    capturePayment();
  }, [captureAttempt, session, sessionStatus, tapId]);

  const retryCapture = () => {
    hasCapturedRef.current = false;
    setCaptureState({
      status: "loading",
      message: "Confirming your Tap subscription...",
    });
    setCaptureAttempt((attempt) => attempt + 1);
  };

  const isLoading = captureState.status === "loading";
  const isSuccess = captureState.status === "success";
  const title = isLoading
    ? "Confirming subscription"
    : isSuccess
      ? "Subscription active!"
      : "Subscription needs attention";

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {isSuccess ? <ConfettiBurst /> : !isLoading ? <DriftingLeaves /> : null}
      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-col items-center justify-center gap-6"
        >
          <FreshDateMascot mood="celebrating" size="xxxl" />
          <h2 className="text-2xl font-bold text-foreground text-center max-w-md">
            {isSuccess
              ? "You're all set — enjoy Premium!"
              : "Confirming your subscription..."}
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
            {!isLoading && (
              <ResultIconBadge
                icon={isSuccess ? PartyPopper : RefreshCw}
                variant={isSuccess ? "success" : "failed"}
              />
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              {title}
            </h1>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              {captureState.message}
            </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {captureState.status === "error" && (
              <Button
                onClick={retryCapture}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Confirming Again
              </Button>
            )}

            <Button
              variant={isSuccess ? "default" : "outline"}
              className={
                isSuccess
                  ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                  : ""
              }
              onClick={() => router.push("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  isSuccess
                    ? "/store?refetch=subscription&payment=success"
                    : "/store",
                )
              }
            >
              View Membership
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

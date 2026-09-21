"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import {
  captureTapSubscriptionCharge,
  fetchCurrentSubscription,
} from "@/services/api/payment";
import { toast } from "@/components/nakhlah/Toast";
import PaymentResultView from "@/components/nakhlah/PaymentResultView";

export default function TapSubscriptionSuccessClient() {
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const hasCapturedRef = useRef(false);
  const tapId = searchParams.get("tap_id") || "";
  const [captureState, setCaptureState] = useState({
    status: "loading",
    message:
      "We're checking the subscription charge with Tap. Your plan won't change until this finishes.",
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
  }, [session, sessionStatus, tapId]);

  return (
    <PaymentResultView
      status={captureState.status}
      kind="subscription"
      gateway="Tap"
      message={captureState.message}
    />
  );
}

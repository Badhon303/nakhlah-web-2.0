"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { captureTapDateCharge } from "@/services/api/payment";
import { toast } from "@/components/nakhlah/Toast";
import PaymentResultView from "@/components/nakhlah/PaymentResultView";

export default function TapDateSuccessClient() {
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const hasCapturedRef = useRef(false);
  const tapId = searchParams.get("tap_id") || "";
  const [captureState, setCaptureState] = useState({
    status: "loading",
    message: "Confirming your Tap payment...",
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
          message: "Please log in again so we can confirm this payment.",
        });
        return;
      }

      hasCapturedRef.current = true;
      const result = await captureTapDateCharge(
        tapId,
        getSessionToken(session),
      );

      if (!result.success) {
        hasCapturedRef.current = false;
        setCaptureState({
          status: "error",
          message: result.error || "Unable to confirm your Tap payment.",
        });
        toast.error(result.error || "Unable to confirm Tap payment.");
        return;
      }

      setCaptureState({
        status: "success",
        message:
          result.message ||
          "Payment confirmed successfully. Your dates have been added.",
      });
      toast.success(result.message || "Payment confirmed successfully.");
    };

    capturePayment();
  }, [session, sessionStatus, tapId]);

  return (
    <PaymentResultView
      status={captureState.status}
      kind="dates"
      gateway="Tap"
      message={captureState.message}
    />
  );
}

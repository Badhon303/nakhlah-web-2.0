"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { captureDatePaymentOrder } from "@/services/api";
import { toast } from "@/components/nakhlah/Toast";
import PaymentCancelledView from "@/components/nakhlah/PaymentCancelledView";
import PaymentResultView from "@/components/nakhlah/PaymentResultView";

export default function PaymentReturnClient() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const hasCapturedRef = useRef(false);
  const type = String(params?.type || "");
  const status = String(params?.status || "");
  const orderId = searchParams.get("token") || "";
  const payerId = searchParams.get("PayerID") || "";
  const isDatePayment = type === "dates";
  const isCanceled = status === "payment-canceled";
  const [captureState, setCaptureState] = useState({
    status: isCanceled ? "canceled" : "loading",
    message: isCanceled
      ? "Your PayPal checkout was canceled, so no charge was completed."
      : "Confirming your PayPal payment...",
  });

  useEffect(() => {
    if (!isDatePayment || isCanceled) return;
    if (sessionStatus === "loading" || hasCapturedRef.current) return;

    const capturePayment = async () => {
      if (!orderId) {
        setCaptureState({
          status: "error",
          message: "Missing PayPal order token. Please contact support.",
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
      const result = await captureDatePaymentOrder(
        orderId,
        getSessionToken(session),
      );

      if (!result.success) {
        hasCapturedRef.current = false;
        setCaptureState({
          status: "error",
          message: result.error || "Unable to confirm your PayPal payment.",
        });
        toast.error(result.error || "Unable to confirm PayPal payment.");
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
  }, [isCanceled, isDatePayment, orderId, session, sessionStatus]);

  if (isCanceled) {
    return (
      <PaymentCancelledView
        eyebrow={
          isDatePayment ? "Date package checkout" : "Subscription checkout"
        }
        title={
          isDatePayment
            ? "Your Date purchase was canceled."
            : "Your subscription checkout was canceled."
        }
        description={
          isDatePayment
            ? "Your Date balance was not changed. Choose another package or return when you need an extra boost."
            : "Your membership was not changed. You can review the available plans and try again anytime."
        }
        primaryLabel={
          isDatePayment ? "Choose another package" : "Choose another plan"
        }
        onPrimary={() =>
          router.push(
            isDatePayment
              ? "/store?refetch=dates"
              : "/store?refetch=subscription",
          )
        }
        onHome={() => router.push("/")}
      />
    );
  }

  return (
    <PaymentResultView
      status={captureState.status}
      kind={isDatePayment ? "dates" : "subscription"}
      gateway="PayPal"
      message={captureState.message}
    />
  );
}

import { Suspense } from "react";
import TapSubscriptionSuccessClient from "@/app/tap-success/subscription/TapSubscriptionSuccessClient";

export default function SubscriptionPaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <TapSubscriptionSuccessClient />
    </Suspense>
  );
}

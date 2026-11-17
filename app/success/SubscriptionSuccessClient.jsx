"use client";

import PaymentResultView from "@/components/nakhlah/PaymentResultView";

export default function SubscriptionSuccessClient() {
  return (
    <PaymentResultView
      status="success"
      kind="subscription"
      gateway="PayPal"
      message="Your premium subscription is now active. Enjoy unlimited palms, advanced analytics and all premium features."
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import PolicyDocumentPage from "../profile/components/PolicyDocument";

export default function PaymentSubscriptionPolicyRoutePage() {
  const router = useRouter();

  return (
    <PolicyDocumentPage
      onBack={() => router.push("/")}
      policyKey="paymentAndSubscriptionPolicy"
      title="Payment & Subscription Policy"
      standalone
    />
  );
}

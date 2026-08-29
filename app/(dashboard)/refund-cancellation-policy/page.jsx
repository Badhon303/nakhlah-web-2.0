"use client";

import { useRouter } from "next/navigation";
import PolicyDocumentPage from "../profile/components/PolicyDocument";

export default function RefundCancellationPolicyRoutePage() {
  const router = useRouter();

  return (
    <PolicyDocumentPage
      onBack={() => router.push("/")}
      policyKey="refundPolicyAndCancellationPolicy"
      title="Refund & Cancellation Policy"
      standalone
    />
  );
}

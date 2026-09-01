"use client";

import { useRouter } from "next/navigation";
import PaymentCancelledView from "@/components/nakhlah/PaymentCancelledView";

export default function SubscriptionFailedClient() {
  const router = useRouter();

  return (
    <PaymentCancelledView
      eyebrow="Subscription checkout"
      title="Your subscription checkout was not completed."
      description="Your membership was not changed and no charge was completed. Review the available plans and try again whenever you are ready."
      primaryLabel="Choose another plan"
      onPrimary={() => router.push("/store?refetch=subscription")}
      onHome={() => router.push("/")}
    />
  );
}

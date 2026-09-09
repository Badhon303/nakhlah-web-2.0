"use client";

import { useRouter } from "next/navigation";
import PaymentCancelledView from "@/components/nakhlah/PaymentCancelledView";

export default function TapCancelDatesClient() {
  const router = useRouter();

  return (
    <PaymentCancelledView
      eyebrow="Date package checkout"
      title="Your Date purchase was canceled."
      description="Your Date balance was not changed. Choose another package or return when you need an extra boost."
      primaryLabel="Choose another package"
      onPrimary={() => router.push("/store?refetch=dates")}
      onHome={() => router.push("/")}
    />
  );
}

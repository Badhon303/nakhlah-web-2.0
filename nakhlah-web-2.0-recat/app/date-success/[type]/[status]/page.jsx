import { Suspense } from "react";
import PaymentReturnClient from "./PaymentReturnClient";

export function generateStaticParams() {
  return [
    { type: "dates", status: "payment-success" },
    { type: "dates", status: "payment-canceled" },
  ];
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={null}>
      <PaymentReturnClient />
    </Suspense>
  );
}

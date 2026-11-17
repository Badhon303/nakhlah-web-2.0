import { Suspense } from "react";
import TapDateSuccessClient from "@/app/tap-success/dates/TapDateSuccessClient";

export default function DatesPaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <TapDateSuccessClient />
    </Suspense>
  );
}

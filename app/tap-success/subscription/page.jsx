import { Suspense } from "react";
import TapSubscriptionSuccessClient from "./TapSubscriptionSuccessClient";

export default function TapSubscriptionSuccessPage() {
  return (
    <Suspense fallback={null}>
      <TapSubscriptionSuccessClient />
    </Suspense>
  );
}

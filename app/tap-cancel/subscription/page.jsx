import { Suspense } from "react";
import TapCancelSubscriptionClient from "./TapCancelSubscriptionClient";

export default function TapCancelSubscriptionPage() {
  return (
    <Suspense fallback={null}>
      <TapCancelSubscriptionClient />
    </Suspense>
  );
}

import { Suspense } from "react";
import TapCancelDatesClient from "./TapCancelDatesClient";

export default function TapCancelDatesPage() {
  return (
    <Suspense fallback={null}>
      <TapCancelDatesClient />
    </Suspense>
  );
}

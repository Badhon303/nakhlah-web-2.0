import { Suspense } from "react";
import TapDateSuccessClient from "./TapDateSuccessClient";

export default function TapDateSuccessPage() {
  return (
    <Suspense fallback={null}>
      <TapDateSuccessClient />
    </Suspense>
  );
}

import { Suspense } from "react";
import ChallengesHome from "./ChallengesHome";

export default function ChallengesMain() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <ChallengesHome />
      </Suspense>
    </div>
  );
}

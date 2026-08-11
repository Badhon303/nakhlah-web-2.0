"use client";

import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { completeGoogleSignIn, useSession } from "@/lib/auth-client";
import { getSessionToken } from "@/lib/authUtils";
import { fetchMyProfile } from "@/services/api/auth";

export default function SocialRedirectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const resolvedRef = useRef(false);

  useEffect(() => {
    if (resolvedRef.current) return;

    const resolveSocialProfile = async () => {
      if (status === "loading") return;

      let token = getSessionToken(session);
      if (window.location.hash.includes("access_token=")) {
        const result = await completeGoogleSignIn();
        if (!result.ok) {
          resolvedRef.current = true;
          router.replace("/auth/login");
          return;
        }
        token = getSessionToken(result.session);
      }

      if (!token) {
        resolvedRef.current = true;
        router.replace("/auth/login");
        return;
      }

      const profileResult = await fetchMyProfile(token);
      resolvedRef.current = true;

      if (profileResult.success && profileResult.profile) {
        router.replace("/");
        return;
      }

      router.replace("/onboarding?social=1");
    };

    resolveSocialProfile();
  }, [router, session, status]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-6">
      <div className="text-center space-y-4 max-w-sm">
        <FreshDateMascot mood="thinking" size="xxl" />
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-foreground">
            Checking your profile
          </h1>
          <p className="text-muted-foreground">
            We&apos;re taking you to the right place.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { fetchMyProfile } from "@/services/api/auth";

const SESSION_GRACE_MS = 2500;
const SESSION_RETRY_MS = 400;

export default function SocialRedirectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const resolvedRef = useRef(false);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    if (resolvedRef.current) return;
    if (status === "loading") return;

    let cancelled = false;
    let retryTimer;

    const goLogin = (query = "") => {
      if (resolvedRef.current || cancelled) return;
      resolvedRef.current = true;
      router.replace(`/auth/login${query}`);
    };

    const resolveSocialProfile = async () => {
      if (resolvedRef.current || cancelled) return;

      // Backend social-login failed during the Google callback — definitive.
      if (session?.error === "SocialLoginFailed") {
        goLogin("?error=SocialLoginFailed");
        return;
      }

      if (status === "authenticated" && isSessionValid(session)) {
        const token = getSessionToken(session);
        if (!token) {
          goLogin("?error=SessionExpired");
          return;
        }

        const profileResult = await fetchMyProfile(token);
        if (resolvedRef.current || cancelled) return;

        resolvedRef.current = true;
        if (profileResult.success && profileResult.profile) {
          router.replace("/");
          return;
        }

        router.replace("/onboarding?social=1");
        return;
      }

      // After OAuth, the client session can briefly look empty before the
      // JWT cookie is readable. Wait out a short grace window before failing.
      const elapsed = Date.now() - startedAtRef.current;
      if (elapsed < SESSION_GRACE_MS) {
        retryTimer = setTimeout(resolveSocialProfile, SESSION_RETRY_MS);
        return;
      }

      goLogin(
        status === "unauthenticated"
          ? "?error=SocialLoginFailed"
          : "?error=SessionExpired",
      );
    };

    resolveSocialProfile();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [router, session, status]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useSession, signOut, getSessionSync } from "@/lib/auth-client";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { logoutUser } from "@/services/api/auth";
import { ConfirmPrompt } from "@/components/nakhlah/ConfirmPrompt";

const LOGIN_PATH = "/auth/login";

/**
 * Prevents an authenticated user from landing on the login screen via the
 * browser/native back button without explicitly confirming a logout. When a
 * back navigation would otherwise reveal the login page while a session is
 * active, we immediately restore the previous in-app route and show a
 * contextual confirmation dialog instead.
 */
export default function BackNavigationGuard() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && isSessionValid(session);
  const pathname = usePathname();
  const router = useRouter();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const lastSafePathRef = useRef("/");
  const prevPathnameRef = useRef(pathname);
  const prevStatusRef = useRef(status);
  const intentionalLogoutRef = useRef(false);

  useLayoutEffect(() => {
    const prevPathname = prevPathnameRef.current;
    const prevStatus = prevStatusRef.current;
    prevPathnameRef.current = pathname;
    prevStatusRef.current = status;

    if (pathname !== LOGIN_PATH) {
      if (isAuthenticated) {
        lastSafePathRef.current = pathname;
      }
      return;
    }

    if (!isAuthenticated) return;

    // If we just arrived on the login page from somewhere else (a back
    // navigation, a stray link, etc.) while already authenticated, that's
    // always an unintended trip back to sign-in.
    //
    // If we were already sitting on the login page, only skip the
    // confirmation when the user genuinely just submitted the sign-in form
    // (status was "unauthenticated" right before flipping to
    // "authenticated"). Landing on /auth/login with a session that was
    // already valid before this page ever rendered (e.g. typing the URL
    // directly while still logged in) never passes through
    // "unauthenticated", so it still needs confirmation.
    if (prevPathname === LOGIN_PATH && prevStatus === "unauthenticated") {
      return;
    }

    if (intentionalLogoutRef.current) {
      intentionalLogoutRef.current = false;
      return;
    }

    router.replace(lastSafePathRef.current || "/");

    queueMicrotask(() => setShowConfirm(true));
  }, [pathname, isAuthenticated, status, router]);

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    intentionalLogoutRef.current = true;

    try {
      const currentSession = getSessionSync();
      const token = getSessionToken(currentSession);
      await logoutUser(token);
    } catch {
      // ignore network errors, still proceed to clear local session
    }

    await signOut({ redirect: true, callbackUrl: LOGIN_PATH });
  };

  return (
    <ConfirmPrompt
      open={showConfirm}
      onOpenChange={setShowConfirm}
      icon={LogOut}
      title="Log out of Nakhlah?"
      description="Going back would take you to the sign-in screen. You're still logged in, so you'll need to log out first if you want to return there."
      confirmLabel="Log Out"
      cancelLabel="Stay Signed In"
      onConfirm={handleConfirmLogout}
      onCancel={handleCancel}
      isPending={isLoggingOut}
    />
  );
}

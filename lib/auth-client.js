"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { buildApiUrl } from "@/lib/api-config";
import { refreshAccessToken, fetchCurrentUser } from "@/services/api/auth";

const STORAGE_KEY = "nakhlah:auth-session";
const GOOGLE_STATE_KEY = "nakhlah:google-oauth-state";
const GOOGLE_OAUTH_REDIRECT_URI =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI ||
  `${(
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    ""
  ).replace(/\/$/, "")}/api/auth/callback/google`;
let googleSignInInitialized = false;

function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading");
  const refreshTimerRef = useRef(null);
  const scheduleRef = useRef(null);

  const clearSession = useCallback(() => {
    writeStoredSession(null);
    setSession(null);
    setStatus("unauthenticated");
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const setSessionData = useCallback((newSession) => {
    writeStoredSession(newSession);
    setSession(newSession);
    setStatus(newSession ? "authenticated" : "unauthenticated");
  }, []);

  const scheduleTokenRefresh = useCallback(
    (exp) => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      if (!exp) return;

      const msUntilExpiry = exp * 1000 - Date.now() - 60_000;
      if (msUntilExpiry <= 0) return;

      refreshTimerRef.current = setTimeout(async () => {
        const current = readStoredSession();
        if (!current?.accessToken) return;

        const refreshed = await refreshAccessToken(current.accessToken);
        if (refreshed.success && refreshed.token) {
          const me = await fetchCurrentUser(refreshed.token);
          const updated = {
            ...current,
            accessToken: me.success ? me.token : refreshed.token,
            exp: me.success ? me.exp : refreshed.exp,
            error: undefined,
          };
          setSessionData(updated);
          scheduleRef.current?.(updated.exp);
        } else {
          clearSession();
        }
      }, msUntilExpiry);
    },
    [setSessionData, clearSession],
  );

  useEffect(() => {
    scheduleRef.current = scheduleTokenRefresh;
  }, [scheduleTokenRefresh]);

  useEffect(() => {
    const handleSessionChange = () => {
      const stored = readStoredSession();
      if (stored) {
        setSessionData(stored);
        scheduleTokenRefresh(stored.exp);
      } else {
        clearSession();
      }
    };

    window.addEventListener("nakhlah:session-changed", handleSessionChange);

    const stored = readStoredSession();
    if (stored) {
      const now = Date.now() / 1000;
      if (stored.exp && now > stored.exp) {
        (async () => {
          if (stored.accessToken) {
            const refreshed = await refreshAccessToken(stored.accessToken);
            if (refreshed.success && refreshed.token) {
              const me = await fetchCurrentUser(refreshed.token);
              const updated = {
                ...stored,
                accessToken: me.success ? me.token : refreshed.token,
                exp: me.success ? me.exp : refreshed.exp,
                error: undefined,
              };
              setSessionData(updated);
              scheduleTokenRefresh(updated.exp);
              return;
            }
          }
          clearSession();
        })();
      } else {
        queueMicrotask(() => {
          setSessionData(stored);
          scheduleTokenRefresh(stored.exp);
        });
      }
    } else {
      queueMicrotask(() => setStatus("unauthenticated"));
    }

    return () => {
      window.removeEventListener(
        "nakhlah:session-changed",
        handleSessionChange,
      );
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [setSessionData, clearSession, scheduleTokenRefresh]);

  const value = {
    session,
    status,
    setSessionData,
    clearSession,
    scheduleTokenRefresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return { data: null, status: "loading" };
  }
  return { data: ctx.session, status: ctx.status };
}

async function completeSocialLogin({ email, sid, token, name, image }) {
  try {
    const response = await fetch(buildApiUrl("/api/users/social-login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        sid,
        provider: "google",
        socialMediaPictureUrl: image || undefined,
        token,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.token || !data.user) {
      return {
        ok: false,
        error:
          data?.message || data?.errors?.message || "Social sign-in failed",
      };
    }

    const session = {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || name,
        role: data.user.role,
        image: data.user.image || image || "",
      },
      accessToken: data.token,
      exp: data.exp,
      error: undefined,
    };
    writeStoredSession(session);
    window.dispatchEvent(new Event("nakhlah:session-changed"));
    return { ok: true, session, error: null };
  } catch (requestError) {
    return {
      ok: false,
      error: requestError.message || "Social sign-in failed",
    };
  }
}

export async function signIn(provider, options = {}) {
  const { redirect = true, callbackUrl, ...credentials } = options;

  if (provider === "credentials") {
    try {
      const response = await fetch(buildApiUrl("/api/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data?.message || "Authentication failed";
        if (!redirect) {
          return { ok: false, error: errorMsg };
        }
        return { ok: false, error: errorMsg };
      }

      const session = {
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.name,
          role: data.user?.role,
          image: data.user?.image || "",
        },
        accessToken: data.token,
        exp: data.exp,
        error: undefined,
      };

      writeStoredSession(session);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("nakhlah:session-changed"));
      }

      if (redirect) {
        const target = callbackUrl || "/";
        if (typeof window !== "undefined") {
          window.location.href = target;
        }
      }

      return { ok: true, error: null };
    } catch (error) {
      return { ok: false, error: error.message || "Authentication failed" };
    }
  }

  if (provider === "google") {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (typeof window === "undefined") {
      return { ok: false, error: "Google sign-in is only available in a browser" };
    }
    if (!googleClientId) {
      return {
        ok: false,
        error:
          "Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID before building the mobile app.",
      };
    }

    const isCapacitor =
      window.Capacitor?.isNativePlatform?.() ||
      window.location.protocol === "capacitor:" ||
      window.location.protocol === "file:";

    if (isCapacitor) {
      try {
        const { GoogleSignIn } =
          await import("@capawesome/capacitor-google-sign-in");
        if (!googleSignInInitialized) {
          await GoogleSignIn.initialize({
            clientId: googleClientId,
          });
          googleSignInInitialized = true;
        }
        const result = await GoogleSignIn.signIn();
        if (!result.idToken || !result.email || !result.userId) {
          return {
            ok: false,
            error: "Google sign-in did not return an account",
          };
        }
        return completeSocialLogin({
          email: result.email,
          sid: result.userId,
          token: result.idToken,
          name: result.displayName,
          image: result.imageUrl,
        });
      } catch (error) {
        return {
          ok: false,
          error: error.message || "Google sign-in failed",
        };
      }
    }

    const redirectUri =
      GOOGLE_OAUTH_REDIRECT_URI ||
      `${window.location.origin}/api/auth/callback/google`;
    const scope = "openid email profile";
    const stateBase =
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const state = `${stateBase}:${isCapacitor ? "native" : "web"}`;

    sessionStorage.setItem(GOOGLE_STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: "token",
      scope,
      state,
      include_granted_scopes: "true",
      prompt: "select_account",
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    window.location.href = authUrl;
    return { ok: true, error: null };
  }

  return { ok: false, error: `Unknown provider: ${provider}` };
}

export async function completeGoogleSignIn() {
  if (typeof window === "undefined") {
    return {
      ok: false,
      error: "Google sign-in is only available in a browser",
    };
  }

  const hashParams = new URLSearchParams(
    window.location.hash.replace(/^#/, ""),
  );
  const queryParams = new URLSearchParams(window.location.search);
  const error = queryParams.get("error") || hashParams.get("error");
  const accessToken = hashParams.get("access_token");
  const backendToken = queryParams.get("backend_token");
  const state = queryParams.get("state") || hashParams.get("state");
  const expectedState = sessionStorage.getItem(GOOGLE_STATE_KEY);

  window.history.replaceState({}, document.title, window.location.pathname);
  sessionStorage.removeItem(GOOGLE_STATE_KEY);

  if (error) return { ok: false, error: "Google sign-in was cancelled" };
  if (!state || state !== expectedState) {
    return { ok: false, error: "Invalid Google sign-in response" };
  }

  if (backendToken) {
    let user;
    try {
      user = JSON.parse(queryParams.get("user") || "null");
    } catch {
      user = null;
    }
    if (!user) return { ok: false, error: "Invalid Google sign-in response" };

    const session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image || "",
      },
      accessToken: backendToken,
      exp: queryParams.get("exp") ? Number(queryParams.get("exp")) : undefined,
      error: undefined,
    };
    writeStoredSession(session);
    window.dispatchEvent(new Event("nakhlah:session-changed"));
    return { ok: true, session, error: null };
  }

  if (!accessToken) {
    return { ok: false, error: "Invalid Google sign-in response" };
  }

  try {
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const profile = await profileResponse.json().catch(() => ({}));
    if (!profileResponse.ok || !profile.email) {
      return { ok: false, error: "Unable to read your Google account" };
    }

    const response = await fetch(buildApiUrl("/api/users/social-login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: profile.name || profile.email.split("@")[0],
        email: profile.email,
        password: "",
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.token || !data.user) {
      return {
        ok: false,
        error: data?.message || data?.error || "Social sign-in failed",
      };
    }

    const session = {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        image: data.user.image || profile.picture || "",
      },
      accessToken: data.token,
      exp: data.exp,
      error: undefined,
    };
    writeStoredSession(session);
    window.dispatchEvent(new Event("nakhlah:session-changed"));
    return { ok: true, session, error: null };
  } catch (requestError) {
    return {
      ok: false,
      error: requestError.message || "Social sign-in failed",
    };
  }
}

export async function signOut(options = {}) {
  const { redirect = true, callbackUrl = "/auth/login" } = options;

  writeStoredSession(null);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nakhlah:session-changed"));
  }

  if (redirect && typeof window !== "undefined") {
    window.location.href = callbackUrl;
  }

  return { ok: true };
}

export function getSessionSync() {
  return readStoredSession();
}

export { STORAGE_KEY as AUTH_STORAGE_KEY };

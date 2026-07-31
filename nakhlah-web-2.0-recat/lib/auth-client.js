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
import {
  refreshAccessToken,
  fetchCurrentUser,
} from "@/services/api/auth";

const STORAGE_KEY = "nakhlah:auth-session";

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
        setSessionData(stored);
        scheduleTokenRefresh(stored.exp);
      }
    } else {
      setStatus("unauthenticated");
    }

    return () => {
      window.removeEventListener("nakhlah:session-changed", handleSessionChange);
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
    const isCapacitor =
      typeof window !== "undefined" &&
      (window.Capacitor?.isNativePlatform?.() ||
        window.location.protocol === "capacitor:" ||
        window.location.protocol === "file:");
    const redirectUri = isCapacitor
      ? `${process.env.NEXT_PUBLIC_APP_URL || ""}/auth/social-redirect`
      : typeof window !== "undefined"
        ? `${window.location.origin}/auth/social-redirect`
        : "";
    const scope =
      "openid email profile https://www.googleapis.com/auth/userinfo.profile";
    const state = Math.random().toString(36).substring(7);
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}`;

    if (typeof window !== "undefined") {
      window.location.href = authUrl;
    }
    return { ok: true, error: null };
  }

  return { ok: false, error: `Unknown provider: ${provider}` };
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

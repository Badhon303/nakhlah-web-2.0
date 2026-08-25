"use client";

import { useSession } from "next-auth/react";

const GUEST_EMAIL = "guest01@example.com";

export function useIsGuest() {
  const { data: session } = useSession();
  const isGuest = session?.user?.email === GUEST_EMAIL;
  return { isGuest, session };
}

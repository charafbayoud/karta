"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AuthActionState } from "@/lib/auth/actions";

export function useAuthActionRedirect(state: AuthActionState) {
  const router = useRouter();

  useEffect(() => {
    if (!state.redirectTo) return;
    router.push(state.redirectTo);
    router.refresh();
  }, [state.redirectTo, router]);
}

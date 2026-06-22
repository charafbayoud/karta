"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteSavedRouteButtonProps {
  routeId: string;
  redirectTo?: string;
}

export function DeleteSavedRouteButton({ routeId, redirectTo }: DeleteSavedRouteButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (pending) return;

    setPending(true);

    try {
      const res = await fetch(`/api/saved-routes?id=${encodeURIComponent(routeId)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Unable to delete route.");
      }

      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      router.refresh();
    } catch {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className="saved-route-delete"
      onClick={handleDelete}
      disabled={pending}
      aria-label="Delete saved route"
    >
      {pending ? "…" : "Remove"}
    </button>
  );
}

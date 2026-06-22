"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SaveRouteInput } from "@/lib/saved-routes/types";

type SaveState = "checking" | "idle" | "saving" | "saved" | "error";

interface SaveRouteControlProps {
  loginHref: string;
  payload: SaveRouteInput;
  className?: string;
}

export function SaveRouteControl({ loginHref, payload, className }: SaveRouteControlProps) {
  const router = useRouter();
  const [state, setState] = useState<SaveState>("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await fetch("/api/saved-routes?limit=1");
        if (cancelled) return;
        setState("idle");
        if (res.status === 401) {
          setMessage("Connecte-toi pour sauvegarder cette route.");
        }
      } catch {
        if (!cancelled) setState("idle");
      }
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (state === "checking" || state === "saving" || state === "saved") return;

    setState("saving");
    setMessage("");

    try {
      const res = await fetch("/api/saved-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.status === 401) {
        setState("idle");
        setMessage("Connecte-toi pour sauvegarder cette route.");
        router.push(loginHref);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Impossible de sauvegarder cette route.");
      }

      setState("saved");
      setMessage("Route sauvegardée. Retrouve-la sur le dashboard ou dans My Routes.");
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Impossible de sauvegarder cette route.");
    }
  }

  const buttonClassName = className ?? "btn-primary result-save-btn";

  if (state === "checking") {
    return (
      <div className="save-route-control">
        <button type="button" className={buttonClassName} disabled>
          Save Route
        </button>
      </div>
    );
  }

  return (
    <div className="save-route-control">
      <button
        type="button"
        className={buttonClassName}
        onClick={handleSave}
        disabled={state === "saving" || state === "saved"}
      >
        {state === "saving" ? "Saving…" : state === "saved" ? "Saved ✓" : "Save Route"}
      </button>
      {message && (
        <p className={state === "error" ? "save-route-error" : "save-route-hint"} role="status">
          {message}
          {message.includes("Connecte-toi") && (
            <>
              {" "}
              <Link href={loginHref} className="link-accent">
                Se connecter
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}

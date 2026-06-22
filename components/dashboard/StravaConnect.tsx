"use client";

import { useState } from "react";

type ConnectStravaButtonProps = {
  returnTo?: string;
  className?: string;
  label?: string;
};

export function ConnectStravaButton({
  returnTo = "/dashboard",
  className = "btn-primary",
  label = "Connecter Strava",
}: ConnectStravaButtonProps) {
  const href = `/api/strava/auth?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}

type DisconnectStravaButtonProps = {
  className?: string;
  label?: string;
  onDisconnected?: () => void;
};

export function DisconnectStravaButton({
  className = "btn-secondary",
  label = "Déconnecter",
  onDisconnected,
}: DisconnectStravaButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDisconnect() {
    setLoading(true);
    try {
      const response = await fetch("/api/strava/disconnect", { method: "POST" });
      if (response.ok) {
        onDisconnected?.();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleDisconnect}
      disabled={loading}
    >
      {loading ? "Déconnexion…" : label}
    </button>
  );
}

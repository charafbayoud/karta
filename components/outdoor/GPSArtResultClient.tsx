"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RouteResult } from "@/components/outdoor/RouteResult";
import type { GpsArtResult } from "@/types/gps-art";

export function GPSArtResultClient() {
  const router = useRouter();
  const [result, setResult] = useState<GpsArtResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("karta-gps-art-result");
    if (!raw) {
      router.replace("/outdoor/gps-art");
      return;
    }

    try {
      setResult(JSON.parse(raw) as GpsArtResult);
    } catch {
      router.replace("/outdoor/gps-art");
    }
  }, [router]);

  if (!result) {
    return <p className="dashboard-sub">Loading your GPS Art route…</p>;
  }

  return (
    <>
      <RouteResult result={result} />
      <Link href="/outdoor/gps-art" className="link-accent outdoor-result-link">
        Try another shape →
      </Link>
    </>
  );
}

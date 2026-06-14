"use client";

import { FormEvent, useState } from "react";

interface EmailFormProps {
  variant?: "hero" | "final";
}

export function EmailForm({ variant = "hero" }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("success");
      setMessage("You're on the list. Welcome to KARTA.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="karta-success landing-form-success" role="status">
        <p className="landing-form-success-text">{message}</p>
      </div>
    );
  }

  const isLarge = variant === "final";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`landing-form-row ${isLarge ? "landing-form-row-large" : ""}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className={`input-field ${isLarge ? "landing-input-large" : ""}`}
          disabled={status === "loading"}
          aria-label="Email address"
        />
        <button
          type="submit"
          className={`btn-primary ${isLarge ? "landing-btn-large" : ""}`}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining…" : "Join Early Access"}
        </button>
      </div>
      {status === "error" && (
        <p className="landing-form-error" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}

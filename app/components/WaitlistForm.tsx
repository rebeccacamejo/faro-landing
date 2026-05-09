"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { WaitlistConfirmationData } from "@/lib/types";

interface Props {
  onSuccess: (data: WaitlistConfirmationData) => void;
  // URL ?ref= param passed from the server component; cookie is read client-side as fallback
  referralRef?: string;
}

type Status = "idle" | "loading" | "error";

function getRefFromCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/faro_ref=([^;]+)/);
  return match?.[1] ?? undefined;
}

export default function WaitlistForm({ onSuccess, referralRef }: Props) {
  const t = useTranslations("waitlist");
  const locale = useLocale();

  const [audience, setAudience] = useState<"owner" | "advisor">("owner");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const businessRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const email = emailRef.current?.value.trim() ?? "";
    const business = businessRef.current?.value.trim() || undefined;
    // URL param (via page-level searchParams) takes precedence over cookie
    const ref = referralRef ?? getRefFromCookie();

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, business, audience, locale, ref }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      onSuccess(data as WaitlistConfirmationData);
    } catch {
      setErrorMsg(t("networkError"));
      setStatus("error");
    }
  }

  const loading = status === "loading";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto space-y-4"
      noValidate
    >
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          disabled={loading}
          className="w-full px-5 py-4 rounded-md bg-cream text-charcoal placeholder:text-navy/50 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-terracotta disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="business" className="sr-only">
          {t("businessPlaceholder")}
        </label>
        <input
          ref={businessRef}
          id="business"
          name="business"
          type="text"
          autoComplete="organization"
          placeholder={t("businessPlaceholder")}
          disabled={loading}
          className="w-full px-5 py-4 rounded-md bg-cream text-charcoal placeholder:text-navy/50 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-terracotta disabled:opacity-60"
        />
      </div>

      <fieldset disabled={loading}>
        <legend className="sr-only">I am a</legend>
        <div className="flex rounded-md overflow-hidden border border-cream/30 w-fit">
          <button
            type="button"
            onClick={() => setAudience("owner")}
            className={`px-5 py-2.5 font-sans text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-terracotta ${
              audience === "owner"
                ? "bg-cream text-navy font-medium"
                : "bg-transparent text-cream/70 hover:text-cream"
            }`}
            aria-pressed={audience === "owner"}
          >
            {t("audienceBusiness")}
          </button>
          <button
            type="button"
            onClick={() => setAudience("advisor")}
            className={`px-5 py-2.5 font-sans text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-terracotta ${
              audience === "advisor"
                ? "bg-cream text-navy font-medium"
                : "bg-transparent text-cream/70 hover:text-cream"
            }`}
            aria-pressed={audience === "advisor"}
          >
            {t("audienceAdvisor")}
          </button>
        </div>
      </fieldset>

      <div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full bg-terracotta hover:bg-terracotta/90 text-cream font-sans font-medium text-lg px-8 py-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cream focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <Spinner />
              {t("submitting")}
            </span>
          ) : (
            t("submit")
          )}
        </button>

        {status === "error" && errorMsg && (
          <p role="alert" className="mt-3 text-sm text-cream/80 text-center">
            {errorMsg}
          </p>
        )}
      </div>
    </form>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="w-5 h-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

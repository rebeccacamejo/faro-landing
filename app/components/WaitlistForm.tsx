"use client";

import { useState, useRef } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm() {
  const [audience, setAudience] = useState<"business" | "advisor">("business");
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

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, business, audience }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <h3 className="font-serif text-4xl text-cream mb-4">
          We&rsquo;ll be in touch.
        </h3>
        <p className="font-sans text-cream/70 text-lg">
          You&rsquo;re on the list. We&rsquo;ll reach out within a week.
        </p>
      </div>
    );
  }

  const loading = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-4" noValidate>
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
          placeholder="you@yourbusiness.com"
          disabled={loading}
          className="w-full px-5 py-4 rounded-md bg-cream text-charcoal placeholder:text-navy/50 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-terracotta disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="business" className="sr-only">
          What&rsquo;s your business? (optional)
        </label>
        <input
          ref={businessRef}
          id="business"
          name="business"
          type="text"
          autoComplete="organization"
          placeholder="What's your business? (optional)"
          disabled={loading}
          className="w-full px-5 py-4 rounded-md bg-cream text-charcoal placeholder:text-navy/50 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-terracotta disabled:opacity-60"
        />
      </div>

      <fieldset disabled={loading}>
        <legend className="sr-only">I am a</legend>
        <div className="flex rounded-md overflow-hidden border border-cream/30 w-fit">
          <button
            type="button"
            onClick={() => setAudience("business")}
            className={`px-5 py-2.5 font-sans text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-terracotta ${
              audience === "business"
                ? "bg-cream text-navy font-medium"
                : "bg-transparent text-cream/70 hover:text-cream"
            }`}
            aria-pressed={audience === "business"}
          >
            I&rsquo;m a business owner
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
            I&rsquo;m a CPA or advisor
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
              Submitting…
            </span>
          ) : (
            "Join waitlist"
          )}
        </button>

        {status === "error" && errorMsg && (
          <p
            role="alert"
            className="mt-3 text-sm text-cream/80 text-center"
          >
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
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

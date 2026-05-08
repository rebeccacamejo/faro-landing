"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [audience, setAudience] = useState<"business" | "advisor">("business");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h3 className="font-serif text-4xl text-cream mb-4">
          We&rsquo;ll be in touch.
        </h3>
        <p className="font-sans text-cream/70 text-lg">
          You&rsquo;re on the list. We&rsquo;ll reach out as we open spots.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-4">
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@yourbusiness.com"
          className="w-full px-5 py-4 rounded-md bg-cream text-charcoal placeholder:text-navy/50 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
        />
      </div>

      <div>
        <label htmlFor="business" className="sr-only">
          What&rsquo;s your business? (optional)
        </label>
        <input
          id="business"
          name="business"
          type="text"
          placeholder="What's your business? (optional)"
          className="w-full px-5 py-4 rounded-md bg-cream text-charcoal placeholder:text-navy/50 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
        />
      </div>

      <fieldset>
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
            aria-pressed={audience === "advisor"}>
            I&rsquo;m a CPA or advisor
          </button>
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full bg-terracotta hover:bg-terracotta/90 text-cream font-sans font-medium text-lg px-8 py-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cream focus:ring-offset-2 focus:ring-offset-navy"
      >
        Join waitlist
      </button>
    </form>
  );
}

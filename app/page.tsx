import Navbar from "./components/Navbar";
import WaitlistForm from "./components/WaitlistForm";

/* Lighthouse SVG — low-opacity decorative illustration */
function LighthouseBeam() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 right-0 w-64 md:w-80 lg:w-96 h-auto opacity-[0.06] pointer-events-none select-none"
    >
      {/* Beam rays */}
      <line x1="160" y1="180" x2="320" y2="0" stroke="#1A2B4A" strokeWidth="1.5" />
      <line x1="160" y1="180" x2="300" y2="20" stroke="#1A2B4A" strokeWidth="1" />
      <line x1="160" y1="180" x2="260" y2="40" stroke="#1A2B4A" strokeWidth="0.75" />
      <line x1="160" y1="180" x2="320" y2="60" stroke="#1A2B4A" strokeWidth="0.5" />
      {/* Tower */}
      <rect x="145" y="180" width="30" height="120" rx="2" stroke="#1A2B4A" strokeWidth="1.5" fill="none" />
      {/* Lantern room */}
      <rect x="138" y="165" width="44" height="20" rx="3" stroke="#1A2B4A" strokeWidth="1.5" fill="none" />
      {/* Light source dot */}
      <circle cx="160" cy="175" r="5" stroke="#1A2B4A" strokeWidth="1.5" fill="none" />
      {/* Base */}
      <rect x="130" y="300" width="60" height="16" rx="2" stroke="#1A2B4A" strokeWidth="1.5" fill="none" />
      {/* Balcony lines */}
      <line x1="138" y1="230" x2="182" y2="230" stroke="#1A2B4A" strokeWidth="1" />
      <line x1="138" y1="260" x2="182" y2="260" stroke="#1A2B4A" strokeWidth="1" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        {/* ── 1. HERO ─────────────────────────────────────────────── */}
        <section
          aria-labelledby="hero-heading"
          className="relative min-h-[calc(100vh-4rem)] flex items-center pt-16 overflow-hidden"
        >
          <LighthouseBeam />
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32 w-full">
            <div className="max-w-[720px]">
              <h1
                id="hero-heading"
                className="font-serif text-[40px] md:text-[56px] lg:text-[68px] leading-[1.1] tracking-tight text-navy mb-8"
              >
                We make sure ChatGPT recommends your business.
              </h1>
              <p className="font-sans text-lg md:text-xl text-charcoal/70 leading-relaxed mb-10 max-w-[600px]">
                Faro tracks how AI agents recommend small and mid-sized
                businesses across ChatGPT, Claude, Perplexity, and Gemini —
                then makes sure your business is the one they pick. Built for
                South Florida. In English and Español.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="#waitlist"
                  className="bg-terracotta hover:bg-terracotta/90 text-cream font-sans font-medium text-lg px-8 py-4 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-cream"
                >
                  Join the waitlist
                </a>
                <a
                  href="#for-advisors"
                  className="font-sans text-base text-charcoal/60 hover:text-terracotta no-underline hover:no-underline hover:underline transition-colors"
                >
                  For CPAs and advisors →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. THE PROBLEM ──────────────────────────────────────── */}
        <section
          aria-labelledby="problem-heading"
          className="bg-cream-deep"
        >
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <h2
              id="problem-heading"
              className="font-serif text-[32px] md:text-[40px] leading-tight text-navy mb-12 max-w-[700px]"
            >
              Your customers are asking AI who to hire. You want to be the
              answer.
            </h2>
            <div className="max-w-[700px] space-y-6">
              <p className="font-sans text-lg leading-loose text-charcoal">
                About one in ten searches in the US now happen on AI platforms
                instead of Google. That number is growing every month. Your
                customers are already asking ChatGPT, &ldquo;Who&rsquo;s a
                good accountant near me?&rdquo; or &ldquo;What&rsquo;s the best
                HVAC company in Miami?&rdquo; before they ever open a browser
                tab.
              </p>
              <p className="font-sans text-lg leading-loose text-charcoal">
                AI doesn&rsquo;t return ten blue links. It reads its sources,
                forms an opinion, and names one or two businesses. If
                you&rsquo;re not in that answer, you don&rsquo;t exist — no
                matter how good your Google reviews are.
              </p>
              <p className="font-sans text-lg leading-loose text-charcoal">
                Most local and mid-sized businesses have no idea whether
                they&rsquo;re showing up in AI recommendations. There are no
                reports, no dashboards, no alerts. Faro changes that.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. HOW IT WORKS ─────────────────────────────────────── */}
        <section
          id="how-it-works"
          aria-labelledby="how-heading"
          className="bg-cream"
        >
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <h2
              id="how-heading"
              className="font-serif text-[32px] md:text-[40px] text-navy mb-16"
            >
              How Faro works.
            </h2>
            <div className="grid md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
              {/* Step 1 */}
              <div>
                <span
                  aria-hidden="true"
                  className="block font-serif text-[48px] text-terracotta leading-none mb-5"
                >
                  1
                </span>
                <h3 className="font-serif text-xl text-navy mb-4">
                  We track
                </h3>
                <p className="font-sans text-base leading-relaxed text-charcoal/80">
                  We monitor every major AI agent — ChatGPT, Claude, Perplexity,
                  Gemini — for the questions your customers actually ask. We see
                  when you appear, when competitors appear, and which sources AI
                  is citing.
                </p>
              </div>
              {/* Step 2 */}
              <div>
                <span
                  aria-hidden="true"
                  className="block font-serif text-[48px] text-terracotta leading-none mb-5"
                >
                  2
                </span>
                <h3 className="font-serif text-xl text-navy mb-4">
                  We optimize
                </h3>
                <p className="font-sans text-base leading-relaxed text-charcoal/80">
                  We write and publish content that AI agents trust. We get your
                  business into the directories, listicles, and review sites that
                  AI cites most. Done for you — in English and Spanish.
                </p>
              </div>
              {/* Step 3 */}
              <div>
                <span
                  aria-hidden="true"
                  className="block font-serif text-[48px] text-terracotta leading-none mb-5"
                >
                  3
                </span>
                <h3 className="font-serif text-xl text-navy mb-4">
                  We report
                </h3>
                <p className="font-sans text-base leading-relaxed text-charcoal/80">
                  Every month, you and your CPA get a two-page report showing
                  exactly where you stand. No dashboards to learn. No marketing
                  jargon. Just whether AI is recommending you more than last
                  month.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. FOR ADVISORS ─────────────────────────────────────── */}
        <section
          id="for-advisors"
          aria-labelledby="advisors-heading"
          className="bg-cream-deep"
        >
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <h2
                  id="advisors-heading"
                  className="font-serif text-[32px] md:text-[40px] leading-tight text-navy"
                >
                  Are you a CPA or trusted advisor?
                </h2>
              </div>
              <div className="space-y-6">
                <p className="font-sans text-lg leading-relaxed text-charcoal">
                  Faro is built to be offered through advisor relationships.
                  Your clients trust you with their finances, their taxes, and
                  increasingly their business strategy. AI visibility is the
                  next frontier — and it&rsquo;s one they&rsquo;ll need help
                  navigating.
                </p>
                <p className="font-sans text-lg leading-relaxed text-charcoal">
                  Partner firms get co-branded monthly reports, a revenue share
                  on every client they refer, and the option to lock in
                  exclusive territory coverage for their market. We handle
                  everything — you stay the trusted advisor.
                </p>
                <a
                  href="#waitlist?audience=advisor"
                  className="inline-block bg-navy hover:bg-navy/90 text-cream font-sans font-medium text-base px-7 py-3.5 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 focus:ring-offset-cream-deep mt-2"
                >
                  Become a partner
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. WAITLIST ─────────────────────────────────────────── */}
        <section
          id="waitlist"
          aria-labelledby="waitlist-heading"
          className="bg-navy"
        >
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <div className="max-w-lg mx-auto text-center mb-10">
              <h2
                id="waitlist-heading"
                className="font-serif text-[36px] md:text-[48px] text-cream mb-4"
              >
                Join the waitlist.
              </h2>
              <p className="font-sans text-lg text-cream/70">
                We&rsquo;re onboarding our first ten Miami pilot clients. Be one
                of them.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-cream-deep" role="contentinfo">
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-sm text-charcoal/60 text-center sm:text-left">
            Faro &middot; Miami, FL &middot;{" "}
            <a
              href="mailto:hello@heyfaro.com"
              className="text-charcoal/60 hover:text-terracotta no-underline hover:underline transition-colors"
            >
              hello@heyfaro.com
            </a>
          </p>
          <button
            type="button"
            className="font-sans text-sm text-charcoal/50 hover:text-charcoal transition-colors focus:outline-none focus:underline underline-offset-4"
            aria-label="Toggle language between English and Español"
          >
            English / Español
          </button>
        </div>
      </footer>
    </>
  );
}

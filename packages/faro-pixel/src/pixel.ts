/**
 * Faro Attribution Pixel
 * Tracks AI-referred visitors and conversions. Installed via:
 *   <script async src="https://cdn.faro.com/pixel.js" data-client-id="XXX"></script>
 */

const AI_REFERRER_SOURCES: Record<string, string> = {
  "chat.openai.com": "chatgpt",
  "chatgpt.com": "chatgpt",
  "perplexity.ai": "perplexity",
  "claude.ai": "claude",
  "gemini.google.com": "gemini",
  "copilot.microsoft.com": "copilot",
};

const AI_BOT_PATTERNS: Array<[RegExp, string]> = [
  [/GPTBot/i, "chatgpt"],
  [/ClaudeBot/i, "claude"],
  [/PerplexityBot/i, "perplexity"],
  [/anthropic-ai/i, "claude"],
  [/ChatGPT-User/i, "chatgpt"],
];

type EventType = "pageview" | "form_submit" | "phone_click" | "email_click";

interface PixelEvent {
  client_id: string;
  session_id: string;
  event_type: EventType;
  referrer: string;
  user_agent: string;
  url: string;
  ai_source: string | null;
  is_bot: boolean;
  ts: number;
}

function uuid4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem("_faro_sid");
    if (!sid) {
      sid = uuid4();
      sessionStorage.setItem("_faro_sid", sid);
    }
    return sid;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

function detectAIReferrer(referrer: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host in AI_REFERRER_SOURCES) return AI_REFERRER_SOURCES[host];
    for (const domain of Object.keys(AI_REFERRER_SOURCES)) {
      if (host.endsWith("." + domain)) return AI_REFERRER_SOURCES[domain];
    }
  } catch {
    // invalid URL
  }
  return null;
}

function detectAIBot(userAgent: string): string | null {
  for (const [pattern, source] of AI_BOT_PATTERNS) {
    if (pattern.test(userAgent)) return source;
  }
  return null;
}

function isDNTEnabled(): boolean {
  const dnt =
    navigator.doNotTrack ??
    (navigator as unknown as { msDoNotTrack?: string }).msDoNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes";
}

function init(): void {
  // Find our script tag — last one wins if multiple
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    "script[data-client-id]"
  );
  if (!scripts.length) return;
  const script = scripts[scripts.length - 1];
  const clientId = script.getAttribute("data-client-id");
  if (!clientId) return;

  const endpoint =
    script.getAttribute("data-endpoint") ??
    "https://faro-engine.example.com/api/v1/attribution/event";

  if (isDNTEnabled()) return;

  const sessionId = getSessionId();
  const ua = navigator.userAgent ?? "";
  const referrer = document.referrer ?? "";
  const aiSource = detectAIReferrer(referrer) ?? detectAIBot(ua);
  const isBot = detectAIBot(ua) !== null;

  function send(eventType: EventType): void {
    const payload: PixelEvent = {
      client_id: clientId!,
      session_id: sessionId,
      event_type: eventType,
      referrer,
      user_agent: ua,
      url: window.location.href,
      ai_source: aiSource,
      is_bot: isBot,
      ts: Date.now(),
    };
    try {
      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // never throw
    }
  }

  // Pageview on script load
  send("pageview");

  // Form submits
  document.addEventListener(
    "submit",
    () => send("form_submit"),
    { passive: true, capture: true }
  );

  // Phone and email link clicks
  document.addEventListener(
    "click",
    (e: Event) => {
      let target = e.target as HTMLElement | null;
      while (target && target !== document.documentElement) {
        const href = (target as HTMLAnchorElement).getAttribute?.("href") ?? "";
        if (href.startsWith("tel:")) { send("phone_click"); return; }
        if (href.startsWith("mailto:")) { send("email_click"); return; }
        target = target.parentElement;
      }
    },
    { passive: true, capture: true }
  );
}

// Auto-initialize
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

export { init, detectAIReferrer, detectAIBot, isDNTEnabled };

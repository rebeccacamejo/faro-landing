/**
 * Tests for Faro Attribution Pixel
 * Run with: vitest (uses jsdom environment)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { detectAIReferrer, detectAIBot, isDNTEnabled } from "../src/pixel";

// ---------------------------------------------------------------------------
// detectAIReferrer
// ---------------------------------------------------------------------------

describe("detectAIReferrer", () => {
  it("detects ChatGPT from chat.openai.com", () => {
    expect(detectAIReferrer("https://chat.openai.com/some/path")).toBe("chatgpt");
  });

  it("detects ChatGPT from chatgpt.com", () => {
    expect(detectAIReferrer("https://chatgpt.com/")).toBe("chatgpt");
  });

  it("detects Perplexity", () => {
    expect(detectAIReferrer("https://perplexity.ai/search?q=miami+cpa")).toBe("perplexity");
  });

  it("detects Claude", () => {
    expect(detectAIReferrer("https://claude.ai/chat/abc")).toBe("claude");
  });

  it("detects Gemini", () => {
    expect(detectAIReferrer("https://gemini.google.com/app")).toBe("gemini");
  });

  it("detects Microsoft Copilot", () => {
    expect(detectAIReferrer("https://copilot.microsoft.com/")).toBe("copilot");
  });

  it("returns null for organic Google traffic", () => {
    expect(detectAIReferrer("https://www.google.com/search?q=miami+cpa")).toBeNull();
  });

  it("returns null for direct traffic (empty referrer)", () => {
    expect(detectAIReferrer("")).toBeNull();
  });

  it("returns null for an invalid URL string", () => {
    expect(detectAIReferrer("not-a-url")).toBeNull();
  });

  it("handles subdomains of known AI domains", () => {
    // e.g. a future regional subdomain
    expect(detectAIReferrer("https://us.perplexity.ai/search")).toBe("perplexity");
  });
});

// ---------------------------------------------------------------------------
// detectAIBot
// ---------------------------------------------------------------------------

describe("detectAIBot", () => {
  it("detects GPTBot", () => {
    expect(detectAIBot("Mozilla/5.0 GPTBot/1.0")).toBe("chatgpt");
  });

  it("detects ClaudeBot", () => {
    expect(detectAIBot("ClaudeBot/1.0 (+https://anthropic.com/bot)")).toBe("claude");
  });

  it("detects PerplexityBot", () => {
    expect(detectAIBot("PerplexityBot/1.0")).toBe("perplexity");
  });

  it("detects anthropic-ai agent", () => {
    expect(detectAIBot("anthropic-ai/1.0")).toBe("claude");
  });

  it("detects ChatGPT-User", () => {
    expect(detectAIBot("ChatGPT-User/1.0")).toBe("chatgpt");
  });

  it("is case-insensitive for GPTBot", () => {
    expect(detectAIBot("gptbot/1.0")).toBe("chatgpt");
  });

  it("returns null for regular Chrome browser", () => {
    expect(
      detectAIBot(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"
      )
    ).toBeNull();
  });

  it("returns null for Googlebot (search crawler, not AI)", () => {
    expect(detectAIBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(detectAIBot("")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// isDNTEnabled
// ---------------------------------------------------------------------------

describe("isDNTEnabled", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true when navigator.doNotTrack is '1'", () => {
    Object.defineProperty(navigator, "doNotTrack", {
      value: "1",
      configurable: true,
    });
    expect(isDNTEnabled()).toBe(true);
  });

  it("returns false when navigator.doNotTrack is '0'", () => {
    Object.defineProperty(navigator, "doNotTrack", {
      value: "0",
      configurable: true,
    });
    expect(isDNTEnabled()).toBe(false);
  });

  it("returns false when doNotTrack is unset/null", () => {
    Object.defineProperty(navigator, "doNotTrack", {
      value: null,
      configurable: true,
    });
    expect(isDNTEnabled()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Full init() integration test
// ---------------------------------------------------------------------------

describe("pixel init()", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset sessionStorage
    sessionStorage.clear();

    // Mock fetch
    fetchSpy = vi.fn().mockResolvedValue(new Response());
    vi.stubGlobal("fetch", fetchSpy);

    // Reset DNT
    Object.defineProperty(navigator, "doNotTrack", {
      value: null,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    // Remove pixel script tags
    document.querySelectorAll("script[data-client-id]").forEach((el) => el.remove());
  });

  function addPixelScript(clientId: string, endpoint?: string): HTMLScriptElement {
    const s = document.createElement("script");
    s.setAttribute("data-client-id", clientId);
    if (endpoint) s.setAttribute("data-endpoint", endpoint);
    document.head.appendChild(s);
    return s;
  }

  it("fires a pageview event on init", async () => {
    addPixelScript("client-123", "https://test.example.com/api/v1/attribution/event");

    const { init } = await import("../src/pixel");
    init();

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, opts] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://test.example.com/api/v1/attribution/event");
    expect(opts.method).toBe("POST");
    expect(opts.mode).toBe("no-cors");

    const body = JSON.parse(opts.body as string);
    expect(body.client_id).toBe("client-123");
    expect(body.event_type).toBe("pageview");
    expect(typeof body.session_id).toBe("string");
    expect(body.session_id.length).toBeGreaterThan(0);
  });

  it("does not fire when no data-client-id script is present", async () => {
    const { init } = await import("../src/pixel");
    init();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("does not fire when DNT is enabled", async () => {
    Object.defineProperty(navigator, "doNotTrack", {
      value: "1",
      configurable: true,
    });
    addPixelScript("client-dnt", "https://test.example.com/api/v1/attribution/event");

    const { init } = await import("../src/pixel");
    init();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reuses session_id from sessionStorage", async () => {
    sessionStorage.setItem("_faro_sid", "existing-session-abc");
    addPixelScript("client-456", "https://test.example.com/api/v1/attribution/event");

    const { init } = await import("../src/pixel");
    init();

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body as string);
    expect(body.session_id).toBe("existing-session-abc");
  });

  it("detects AI referrer and sets ai_source", async () => {
    Object.defineProperty(document, "referrer", {
      value: "https://chat.openai.com/chat",
      configurable: true,
    });
    addPixelScript("client-789", "https://test.example.com/api/v1/attribution/event");

    const { init } = await import("../src/pixel");
    init();

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body as string);
    expect(body.ai_source).toBe("chatgpt");
    expect(body.is_bot).toBe(false);

    // Reset referrer
    Object.defineProperty(document, "referrer", { value: "", configurable: true });
  });

  it("fires form_submit on form submit event", async () => {
    addPixelScript("client-form", "https://test.example.com/api/v1/attribution/event");

    const { init } = await import("../src/pixel");
    init();
    fetchSpy.mockClear();

    const form = document.createElement("form");
    document.body.appendChild(form);
    form.dispatchEvent(new Event("submit", { bubbles: true }));

    // Multiple listeners may be registered from prior init() calls in the same module cache.
    // We just need at least one call and the last one must be form_submit.
    expect(fetchSpy).toHaveBeenCalled();
    const lastBody = JSON.parse(fetchSpy.mock.lastCall![1].body as string);
    expect(lastBody.event_type).toBe("form_submit");

    form.remove();
  });

  it("fires phone_click when tel: link is clicked", async () => {
    addPixelScript("client-tel", "https://test.example.com/api/v1/attribution/event");

    const { init } = await import("../src/pixel");
    init();
    fetchSpy.mockClear();

    const link = document.createElement("a");
    link.href = "tel:+13055551234";
    document.body.appendChild(link);
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(fetchSpy).toHaveBeenCalled();
    const lastBody = JSON.parse(fetchSpy.mock.lastCall![1].body as string);
    expect(lastBody.event_type).toBe("phone_click");

    link.remove();
  });

  it("fires email_click when mailto: link is clicked", async () => {
    addPixelScript("client-email", "https://test.example.com/api/v1/attribution/event");

    const { init } = await import("../src/pixel");
    init();
    fetchSpy.mockClear();

    const link = document.createElement("a");
    link.href = "mailto:hello@example.com";
    document.body.appendChild(link);
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(fetchSpy).toHaveBeenCalled();
    const lastBody = JSON.parse(fetchSpy.mock.lastCall![1].body as string);
    expect(lastBody.event_type).toBe("email_click");

    link.remove();
  });

  it("does not fire click events for regular links", async () => {
    addPixelScript("client-nofire", "https://test.example.com/api/v1/attribution/event");

    const { init } = await import("../src/pixel");
    init();
    fetchSpy.mockClear();

    const link = document.createElement("a");
    link.href = "https://example.com/about";
    document.body.appendChild(link);
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    // None of the calls (if any) should be for a regular link
    const calls = fetchSpy.mock.calls.map((c) => JSON.parse(c[1].body as string));
    expect(calls.every((b) => b.event_type !== "phone_click" && b.event_type !== "email_click")).toBe(true);

    link.remove();
  });
});

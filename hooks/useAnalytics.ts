"use client";

import { useCallback, useRef } from "react";

// Generates a stable anonymous ID per browser session (not persisted across clears)
function getAnonymousId(): string {
  if (typeof sessionStorage === "undefined") return "ssr";
  const key = "faro_anon";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function useAnalytics() {
  const anonIdRef = useRef<string | null>(null);

  const track = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      if (typeof window === "undefined") return;
      if (!anonIdRef.current) anonIdRef.current = getAnonymousId();

      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: eventName,
          properties: properties ?? {},
          anonymous_id: anonIdRef.current,
        }),
      }).catch(() => {});
    },
    [],
  );

  return { track };
}

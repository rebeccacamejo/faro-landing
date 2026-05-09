"use client";

import { useEffect } from "react";

// On locale switch the LocaleToggle saves scrollY to sessionStorage.
// This component reads it on the new page's first mount, restores the position instantly,
// then clears the key so subsequent navigations are unaffected.
export default function ScrollRestorer() {
  useEffect(() => {
    const saved = sessionStorage.getItem("faro-scroll-restore");
    if (!saved) return;
    sessionStorage.removeItem("faro-scroll-restore");
    const y = parseInt(saved, 10);
    if (!isNaN(y)) {
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    }
  }, []);

  return null;
}

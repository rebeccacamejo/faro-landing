import { ImageResponse } from "next/og";

export const runtime = "edge";

type FontEntry = {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
};

async function fetchGoogleFont(
  family: string,
  weight: number
): Promise<ArrayBuffer | null> {
  try {
    // No User-Agent → Google Fonts returns TTF, which Satori requires (not woff2)
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=block`
    ).then((r) => r.text());

    const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
    if (!url) return null;

    return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET() {
  const [frauncesData, interData] = await Promise.all([
    fetchGoogleFont("Fraunces", 400),
    fetchGoogleFont("Inter", 400),
  ]);

  const fonts: FontEntry[] = [];
  if (frauncesData) fonts.push({ name: "Fraunces", data: frauncesData, weight: 400, style: "normal" });
  if (interData) fonts.push({ name: "Inter", data: interData, weight: 400, style: "normal" });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#F8F4ED",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Centered copy — nudged above midline so wordmark lands in top third */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            marginTop: "-48px",
          }}
        >
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 96,
              fontWeight: 400,
              color: "#1A2B4A",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Faro
          </div>
          <div
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 56,
              fontWeight: 400,
              color: "#1A2B4A",
              lineHeight: 1.15,
              textAlign: "center",
              maxWidth: "900px",
            }}
          >
            AI visibility for your business.
          </div>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 28,
              fontWeight: 400,
              color: "rgba(42, 42, 40, 0.7)",
              textAlign: "center",
              maxWidth: "840px",
              lineHeight: 1.4,
              marginTop: "4px",
            }}
          >
            Get recommended by ChatGPT, Claude, Perplexity, and Gemini.
          </div>
        </div>

        {/* Bottom-left label */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "80px",
            display: "flex",
            fontFamily: "Inter, sans-serif",
            fontSize: 18,
            color: "rgba(42, 42, 40, 0.5)",
          }}
        >
          Miami · English / Español
        </div>

        {/* Bottom-right lighthouse mark */}
        <div
          style={{
            position: "absolute",
            bottom: "76px",
            right: "80px",
            display: "flex",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 64 64">
            <polygon points="32,14 26,22 38,22" fill="#B08D57" />
            <rect x="26" y="22" width="12" height="8" fill="#B08D57" />
            <polygon points="21,54 43,54 38,30 26,30" fill="#B08D57" />
          </svg>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}

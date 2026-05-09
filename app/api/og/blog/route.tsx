import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

type FontEntry = {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
};

async function fetchGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "Faro — AI Visibility";
  const subtitle = searchParams.get("subtitle") ?? "";

  const [frauncesData, interData] = await Promise.all([
    fetchGoogleFont("Fraunces", 400),
    fetchGoogleFont("Inter", 400),
  ]);

  const fonts: FontEntry[] = [];
  if (frauncesData) fonts.push({ name: "Fraunces", data: frauncesData, weight: 400, style: "normal" });
  if (interData) fonts.push({ name: "Inter", data: interData, weight: 400, style: "normal" });

  // Truncate title for safe display
  const displayTitle = title.length > 72 ? title.slice(0, 69) + "..." : title;
  const displaySubtitle = subtitle.length > 110 ? subtitle.slice(0, 107) + "..." : subtitle;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#F8F4ED",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 28,
            color: "#B08D57",
            letterSpacing: "-0.01em",
            marginBottom: "auto",
          }}
        >
          Faro
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: 56,
            fontWeight: 400,
            color: "#1A2B4A",
            lineHeight: 1.15,
            maxWidth: "900px",
            marginBottom: subtitle ? "20px" : "0",
          }}
        >
          {displayTitle}
        </div>

        {/* Subtitle / excerpt */}
        {displaySubtitle && (
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 24,
              color: "rgba(42, 42, 40, 0.65)",
              lineHeight: 1.5,
              maxWidth: "820px",
            }}
          >
            {displaySubtitle}
          </div>
        )}

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "32px",
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 18,
              color: "rgba(42, 42, 40, 0.45)",
            }}
          >
            heyfaro.com · Miami · English / Español
          </div>
          <svg width="30" height="30" viewBox="0 0 64 64">
            <polygon points="32,14 26,22 38,22" fill="#B08D57" />
            <rect x="26" y="22" width="12" height="8" fill="#B08D57" />
            <polygon points="21,54 43,54 38,30 26,30" fill="#B08D57" />
          </svg>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts }
  );
}

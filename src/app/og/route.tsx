import { ImageResponse } from "next/og";
import { siteConfig, OG_IMAGE_SIZE } from "@/lib/site";

/**
 * /og — dynamic social card generator. One deterministic endpoint (driven by
 * ?title= & ?eyebrow=) so every page gets a branded OpenGraph/Twitter image and
 * the JSON-LD `image` for that page resolves to the exact same asset. Rendered
 * with Satori (flexbox-only CSS) via next/og.
 *
 * Brand hexes are inlined because Satori can't read CSS custom properties; they
 * mirror the indigo/terracotta marks in src/app/icon.svg.
 */

const INDIGO = "#5b63d6";
const TERRACOTTA = "#e0563f";
const BG = "#0b0d12";
const INK = "#f7f9fd";
const MUTED = "#8a8fa6";
const LINE = "#22252f";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") ?? siteConfig.name;
  const title = rawTitle.length > 110 ? `${rawTitle.slice(0, 109)}…` : rawTitle;
  const eyebrow = searchParams.get("eyebrow") ?? "";
  // Smaller type for longer headlines so they never overflow the card.
  const titleSize = title.length > 70 ? 60 : title.length > 44 ? 72 : 86;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          padding: "72px 80px",
          // Accent rule along the top edge.
          borderTop: `12px solid ${INDIGO}`,
        }}
      >
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: INDIGO,
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </div>
        ) : (
          <div style={{ display: "flex" }} />
        )}

        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            color: INK,
            fontWeight: 600,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Logo mark: rounded tile with three bars + dot (see icon.svg). */}
            <div
              style={{
                position: "relative",
                display: "flex",
                width: 56,
                height: 56,
                borderRadius: 13,
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 11,
                  top: 14,
                  width: 34,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: INDIGO,
                  display: "flex",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 11,
                  top: 25,
                  width: 26,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#c7cbe0",
                  display: "flex",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 11,
                  top: 36,
                  width: 17,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#c7cbe0",
                  display: "flex",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 9,
                  top: 12,
                  width: 11,
                  height: 11,
                  borderRadius: 6,
                  backgroundColor: TERRACOTTA,
                  display: "flex",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 18,
                fontSize: 30,
                fontWeight: 600,
                color: INK,
              }}
            >
              {siteConfig.name}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: MUTED }}>
            aeocanon.com
          </div>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      headers: {
        // Static per (title, eyebrow); cache aggressively at the edge.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}

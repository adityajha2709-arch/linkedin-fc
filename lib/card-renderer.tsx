import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "fs/promises";
import path from "path";
import type { CardData } from "@/types/profile";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_GOLD_LIGHT,
  CARD_GOLD_MID,
  CARD_GOLD_PRIMARY,
  CARD_GOLD_DARK,
  CARD_GOLD_DARKER,
  CARD_GOLD_CENTER,
  CARD_GOLD_EDGE,
  CARD_BORDER_COLOR,
  CARD_TEXT_DARK,
  CARD_NAME_BAND,
  CARD_NAME_TEXT,
  CARD_WATERMARK,
  CARD_BORDER_WIDTH,
} from "@/config/constants";
import { getInitials } from "@/lib/role-abbrev";
import type { ReactNode } from "react";

// Cache font buffers at module level (loaded once per cold start)
let fontCache: { regular: Buffer; bold: Buffer; black: Buffer } | null = null;

async function loadFonts() {
  if (fontCache) return fontCache;

  const fontDir = path.join(process.cwd(), "public", "fonts");
  const [regular, bold, black] = await Promise.all([
    readFile(path.join(fontDir, "Geist-Regular.ttf")),
    readFile(path.join(fontDir, "Geist-Bold.ttf")),
    readFile(path.join(fontDir, "Geist-Black.ttf")),
  ]);

  fontCache = { regular, bold, black };
  return fontCache;
}

function buildCardJsx(data: CardData): ReactNode {
  const initials = getInitials(data.name);

  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: `radial-gradient(ellipse at 50% 35%, ${CARD_GOLD_CENTER} 0%, ${CARD_GOLD_LIGHT} 25%, ${CARD_GOLD_MID} 45%, ${CARD_GOLD_PRIMARY} 65%, ${CARD_GOLD_DARK} 85%, ${CARD_GOLD_EDGE} 100%)`,
        fontFamily: "Geist",
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        border: `${CARD_BORDER_WIDTH}px solid ${CARD_BORDER_COLOR}`,
      }}
    >
      {/* Sunburst ray overlays — radiating light streaks like EA FC */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(0deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(30deg, transparent 35%, rgba(255,255,255,0.06) 48%, transparent 55%)`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(60deg, transparent 35%, rgba(255,255,255,0.05) 48%, transparent 55%)`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.05) 48%, transparent 55%)`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(150deg, transparent 35%, rgba(255,255,255,0.06) 48%, transparent 55%)`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)`,
          display: "flex",
        }}
      />

      {/* Inner border accent */}
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 5,
          right: 5,
          bottom: 5,
          borderRadius: 10,
          border: `1px solid rgba(255, 255, 255, 0.12)`,
          display: "flex",
        }}
      />

      {/* === Top section: Rating (left) + Photo (center) === */}
      <div
        style={{
          display: "flex",
          width: "100%",
          position: "relative",
          height: 280,
        }}
      >
        {/* Rating — top-left */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            left: 24,
            top: 18,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: CARD_TEXT_DARK,
              lineHeight: 1,
              letterSpacing: -1,
            }}
          >
            {data.overallRating}
          </span>
        </div>

        {/* Photo frame with shadow glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            marginLeft: -99,
            top: 16,
            width: 198,
            height: 238,
            borderRadius: 10,
            background: "rgba(44, 24, 16, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Photo container */}
          <div
            style={{
              width: 190,
              height: 230,
              borderRadius: 8,
              border: `3px solid ${CARD_GOLD_DARKER}`,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(44, 24, 16, 0.08)",
              position: "relative",
            }}
          >
            {data.photo ? (
              /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */
              <img
                src={data.photo}
                width={190}
                height={230}
                style={{
                  objectFit: "cover",
                  objectPosition: "top center",
                  borderRadius: 6,
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: CARD_TEXT_DARK,
                  opacity: 0.35,
                }}
              >
                {initials}
              </span>
            )}
            {/* Subtle bottom fade inside frame */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 50,
                background: `linear-gradient(to top, rgba(139, 114, 50, 0.5), rgba(139, 114, 50, 0))`,
                display: "flex",
              }}
            />
          </div>
        </div>
      </div>

      {/* Thin separator line above name */}
      <div
        style={{
          width: "70%",
          height: 1,
          background: "rgba(44, 24, 16, 0.2)",
          display: "flex",
        }}
      />

      {/* === Name band === */}
      <div
        style={{
          width: "100%",
          background: `linear-gradient(90deg, rgba(184,148,64,0), ${CARD_NAME_BAND}, ${CARD_NAME_BAND}, rgba(184,148,64,0))`,
          padding: "8px 0 6px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: CARD_NAME_TEXT,
            letterSpacing: 3,
            textAlign: "center",
          }}
        >
          {data.name.toUpperCase()}
        </span>
      </div>

      {/* Role + Company */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 400,
          color: "rgba(44, 24, 16, 0.5)",
          marginTop: 2,
          textAlign: "center",
        }}
      >
        {data.currentRole} · {data.currentCompany}
      </span>

      {/* === Stats grid (2 rows of 3) === */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "90%",
          marginTop: 6,
          borderTop: "1px solid rgba(44, 24, 16, 0.15)",
        }}
      >
        {/* Row 1: skills[0..2] */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 0 6px",
          }}
        >
          {data.skills.slice(0, 3).map((skill, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0 14px",
                  minWidth: 80,
                }}
              >
                <span
                  style={{
                    fontSize: skill.label.length > 12 ? 7 : 8,
                    fontWeight: 700,
                    color: "rgba(44, 24, 16, 0.55)",
                    letterSpacing: 1,
                  }}
                >
                  {skill.label.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: CARD_TEXT_DARK,
                    lineHeight: 1,
                    marginTop: 1,
                  }}
                >
                  {skill.score}
                </span>
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: 1,
                    height: 32,
                    background: "rgba(44, 24, 16, 0.12)",
                    display: "flex",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Horizontal divider between rows */}
        <div
          style={{
            width: "75%",
            height: 1,
            background: "rgba(44, 24, 16, 0.1)",
            alignSelf: "center",
            display: "flex",
          }}
        />

        {/* Row 2: skills[3..5] */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "6px 0 8px",
          }}
        >
          {data.skills.slice(3, 6).map((skill, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0 14px",
                  minWidth: 80,
                }}
              >
                <span
                  style={{
                    fontSize: skill.label.length > 12 ? 7 : 8,
                    fontWeight: 700,
                    color: "rgba(44, 24, 16, 0.55)",
                    letterSpacing: 1,
                  }}
                >
                  {skill.label.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: CARD_TEXT_DARK,
                    lineHeight: 1,
                    marginTop: 1,
                  }}
                >
                  {skill.score}
                </span>
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: 1,
                    height: 32,
                    background: "rgba(44, 24, 16, 0.12)",
                    display: "flex",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* === Watermark === */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: 6,
          paddingBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 6,
            color: "rgba(44, 24, 16, 0.15)",
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          {CARD_WATERMARK}
        </span>
      </div>
    </div>
  );
}

export async function renderCardToSvg(cardData: CardData): Promise<string> {
  const fonts = await loadFonts();
  const element = buildCardJsx(cardData);

  return satori(element as React.ReactElement, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: [
      { name: "Geist", data: fonts.regular, weight: 400, style: "normal" as const },
      { name: "Geist", data: fonts.bold, weight: 700, style: "normal" as const },
      { name: "Geist", data: fonts.black, weight: 900, style: "normal" as const },
    ],
  });
}

export function convertSvgToPng(svg: string): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width" as const, value: CARD_WIDTH },
  });
  const pngData = resvg.render();
  return pngData.asPng() as Buffer;
}

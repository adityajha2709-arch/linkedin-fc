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
  CARD_BORDER_COLOR,
  CARD_TEXT_DARK,
  CARD_NAME_BAND,
  CARD_WATERMARK,
  CARD_BORDER_WIDTH,
} from "@/config/constants";
import { deriveRoleAbbrev, getCompanyInitial, getInitials } from "@/lib/role-abbrev";
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
  const pos = deriveRoleAbbrev(data.currentRole);
  const companyInitial = getCompanyInitial(data.currentCompany);
  const initials = getInitials(data.name);

  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: `linear-gradient(165deg, ${CARD_GOLD_LIGHT} 0%, ${CARD_GOLD_MID} 35%, ${CARD_GOLD_PRIMARY} 65%, ${CARD_GOLD_DARK} 100%)`,
        fontFamily: "Geist",
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        border: `${CARD_BORDER_WIDTH}px solid ${CARD_BORDER_COLOR}`,
      }}
    >
      {/* Geometric texture overlays */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(30deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)`,
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
          background: `linear-gradient(150deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)`,
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
          background: `linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)`,
          display: "flex",
        }}
      />

      {/* Inner border accent */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          right: 6,
          bottom: 6,
          borderRadius: 12,
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          display: "flex",
        }}
      />

      {/* === Top section: Rating column (left) + Photo (center) === */}
      <div
        style={{
          display: "flex",
          width: "100%",
          position: "relative",
          padding: "24px 28px 0",
          height: 280,
        }}
      >
        {/* Rating + Position + Badge column (top-left) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            left: 32,
            top: 28,
            zIndex: 2,
          }}
        >
          {/* Rating */}
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: CARD_TEXT_DARK,
              lineHeight: 1,
            }}
          >
            {data.overallRating}
          </span>
          {/* Position */}
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: CARD_TEXT_DARK,
              letterSpacing: 2,
              marginTop: 2,
            }}
          >
            {pos}
          </span>
          {/* Company badge */}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              background: `linear-gradient(180deg, ${CARD_GOLD_DARK}, ${CARD_GOLD_DARKER})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${CARD_TEXT_DARK}`,
              marginTop: 8,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: CARD_TEXT_DARK,
              }}
            >
              {companyInitial}
            </span>
          </div>
        </div>

        {/* Photo (centered) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            marginLeft: -90,
            top: 20,
            width: 180,
            height: 220,
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `rgba(44, 24, 16, 0.1)`,
          }}
        >
          {data.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */
            <img
              src={data.photo}
              width={180}
              height={220}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: CARD_TEXT_DARK,
                opacity: 0.5,
              }}
            >
              {initials}
            </span>
          )}
          {/* Bottom fade overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 70,
              background: `linear-gradient(to top, ${CARD_GOLD_MID}, rgba(212, 185, 110, 0))`,
              display: "flex",
            }}
          />
        </div>
      </div>

      {/* === Name band === */}
      <div
        style={{
          width: "100%",
          background: `linear-gradient(90deg, rgba(184, 152, 58, 0), ${CARD_NAME_BAND}, ${CARD_NAME_BAND}, rgba(184, 152, 58, 0))`,
          padding: "10px 0 8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: CARD_TEXT_DARK,
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
          color: "rgba(44, 24, 16, 0.55)",
          marginTop: 4,
          textAlign: "center",
        }}
      >
        {data.currentRole} · {data.currentCompany}
      </span>

      {/* === Stats row === */}
      <div
        style={{
          display: "flex",
          width: "90%",
          justifyContent: "center",
          alignItems: "center",
          padding: "14px 0",
          marginTop: 16,
          borderTop: `1px solid rgba(44, 24, 16, 0.15)`,
          borderBottom: `1px solid rgba(44, 24, 16, 0.15)`,
          background: `linear-gradient(90deg, rgba(168, 138, 53, 0), rgba(168, 138, 53, 0.25), rgba(168, 138, 53, 0.25), rgba(168, 138, 53, 0))`,
        }}
      >
        {data.skills.slice(0, 6).map((skill, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            {/* Stat cell */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0 10px",
                minWidth: 52,
              }}
            >
              <span
                style={{
                  fontSize: skill.label.length > 10 ? 7 : 9,
                  fontWeight: 700,
                  color: "rgba(44, 24, 16, 0.7)",
                  letterSpacing: 0.5,
                  textAlign: "center",
                }}
              >
                {skill.label.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: CARD_TEXT_DARK,
                  lineHeight: 1,
                  marginTop: 3,
                }}
              >
                {skill.score}
              </span>
            </div>
            {/* Divider (not after last) */}
            {i < 5 && (
              <div
                style={{
                  width: 1,
                  height: 32,
                  background: "rgba(44, 24, 16, 0.2)",
                  display: "flex",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* === Watermark === */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "auto",
          paddingBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 8,
            color: "rgba(44, 24, 16, 0.25)",
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

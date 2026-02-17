import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "fs/promises";
import path from "path";
import type { CardData } from "@/types/profile";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_BG_GRADIENT_START,
  CARD_BG_GRADIENT_END,
  CARD_TEXT_DARK,
  CARD_WATERMARK,
} from "@/config/constants";
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

function derivePosition(role: string): string {
  const lower = role.toLowerCase();
  if (/ceo|founder|chief|president|owner/.test(lower)) return "GK";
  if (/director|vp|head/.test(lower)) return "CB";
  if (/manager|lead|principal/.test(lower)) return "CDM";
  if (/design|ux|ui|creative/.test(lower)) return "CAM";
  if (/data|analy|research|scien/.test(lower)) return "CM";
  if (/engineer|develop|program|software/.test(lower)) return "CM";
  if (/market|growth|brand/.test(lower)) return "RW";
  if (/sales|business dev|account/.test(lower)) return "ST";
  if (/consult|advis/.test(lower)) return "CF";
  if (/product/.test(lower)) return "AM";
  return "CM";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function buildCardJsx(data: CardData): ReactNode {
  const pos = derivePosition(data.currentRole);
  const initials = getInitials(data.name);

  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: `linear-gradient(165deg, ${CARD_BG_GRADIENT_START} 0%, ${CARD_BG_GRADIENT_END} 50%, #8B6914 100%)`,
        fontFamily: "Geist",
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        padding: "28px 24px 16px",
      }}
    >
      {/* Inner border accent */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          right: 8,
          bottom: 8,
          borderRadius: 14,
          border: `1px solid rgba(10, 22, 40, 0.12)`,
          display: "flex",
        }}
      />

      {/* Top section: Rating + Photo */}
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 24,
          marginTop: 8,
        }}
      >
        {/* Rating + Position column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <span
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: CARD_TEXT_DARK,
              lineHeight: 1,
            }}
          >
            {data.overallRating}
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: CARD_TEXT_DARK,
              letterSpacing: 3,
              marginTop: 4,
            }}
          >
            {pos}
          </span>
        </div>

        {/* Photo */}
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            overflow: "hidden",
            border: `3px solid ${CARD_TEXT_DARK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(10, 22, 40, 0.15)",
          }}
        >
          {data.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */
            <img
              src={data.photo}
              width={150}
              height={150}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: CARD_TEXT_DARK,
                opacity: 0.6,
              }}
            >
              {initials}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <span
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: CARD_TEXT_DARK,
          marginTop: 16,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        {data.name.toUpperCase()}
      </span>

      {/* Role + Company */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 400,
          color: "rgba(10, 22, 40, 0.55)",
          marginTop: 4,
          textAlign: "center",
        }}
      >
        {data.currentRole} · {data.currentCompany}
      </span>

      {/* Divider */}
      <div
        style={{
          width: "80%",
          height: 1,
          background: "rgba(10, 22, 40, 0.2)",
          marginTop: 18,
          marginBottom: 14,
          display: "flex",
        }}
      />

      {/* Skills grid: 2 rows x 3 cols */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "92%",
        }}
      >
        {data.skills.slice(0, 6).map((skill, i) => (
          <div
            key={i}
            style={{
              width: "33.33%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 0",
            }}
          >
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: CARD_TEXT_DARK,
                lineHeight: 1,
              }}
            >
              {skill.score}
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 400,
                color: "rgba(10, 22, 40, 0.6)",
                marginTop: 4,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                textAlign: "center",
              }}
            >
              {skill.label}
            </span>
          </div>
        ))}
      </div>

      {/* Watermark */}
      <span
        style={{
          position: "absolute",
          bottom: 14,
          right: 18,
          fontSize: 9,
          color: "rgba(10, 22, 40, 0.3)",
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
      >
        {CARD_WATERMARK}
      </span>
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

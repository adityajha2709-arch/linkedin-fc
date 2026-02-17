import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_GOLD_MID,
  CARD_GOLD_CENTER,
  CARD_GOLD_LIGHT,
  CARD_GOLD_PRIMARY,
  CARD_GOLD_DARK,
  CARD_GOLD_EDGE,
  CARD_GOLD_DARKER,
  CARD_BORDER_COLOR,
  CARD_BORDER_WIDTH,
  CARD_TEXT_DARK,
  CARD_NAME_BAND,
  CARD_NAME_TEXT,
} from "@/config/constants";

const SAMPLE = {
  name: "SARAH CHEN",
  rating: 92,
  role: "Product Lead",
  company: "TechCorp",
  initials: "SC",
  skills: [
    { label: "STRATEGY", score: 94 },
    { label: "LEADERSHIP", score: 91 },
    { label: "ANALYTICS", score: 88 },
    { label: "COMM", score: 90 },
    { label: "EXECUTION", score: 87 },
    { label: "VISION", score: 93 },
  ],
};

function StatCell({ label, score }: { label: string; score: number }) {
  return (
    <div
      className="flex flex-col items-center"
      style={{ padding: "0 14px", minWidth: 80 }}
    >
      <span
        className="text-center"
        style={{
          fontSize: 8,
          fontWeight: 700,
          color: "rgba(44, 24, 16, 0.55)",
          letterSpacing: 1,
        }}
      >
        {label}
      </span>
      <span
        className="leading-none"
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: CARD_TEXT_DARK,
          marginTop: 1,
        }}
      >
        {score}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 32,
        backgroundColor: "rgba(44, 24, 16, 0.12)",
      }}
    />
  );
}

export default function SampleCardPreview() {
  return (
    <div
      className="pointer-events-none select-none"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        background: `radial-gradient(ellipse at 50% 35%, ${CARD_GOLD_CENTER} 0%, ${CARD_GOLD_LIGHT} 25%, ${CARD_GOLD_MID} 45%, ${CARD_GOLD_PRIMARY} 65%, ${CARD_GOLD_DARK} 85%, ${CARD_GOLD_EDGE} 100%)`,
        borderRadius: 14,
        border: `${CARD_BORDER_WIDTH}px solid ${CARD_BORDER_COLOR}`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Sunburst overlays */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(60deg, transparent 35%, rgba(255,255,255,0.05) 48%, transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.05) 48%, transparent 55%)",
        }}
      />

      {/* Inner border accent */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: 5,
          left: 5,
          right: 5,
          bottom: 5,
          borderRadius: 10,
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      />

      {/* Top section: Rating + Photo */}
      <div className="relative w-full" style={{ height: 280 }}>
        {/* Rating */}
        <div
          className="absolute z-[2] flex flex-col items-center"
          style={{ left: 24, top: 18 }}
        >
          <span
            className="leading-none"
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: CARD_TEXT_DARK,
              letterSpacing: -1,
            }}
          >
            {SAMPLE.rating}
          </span>
        </div>

        {/* Photo frame with initials */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            left: "50%",
            marginLeft: -99,
            top: 16,
            width: 198,
            height: 238,
            borderRadius: 10,
            background: "rgba(44, 24, 16, 0.15)",
          }}
        >
          <div
            className="flex items-center justify-center overflow-hidden"
            style={{
              width: 190,
              height: 230,
              borderRadius: 8,
              border: `3px solid ${CARD_GOLD_DARKER}`,
              backgroundColor: "rgba(44, 24, 16, 0.08)",
            }}
          >
            <span
              className="flex h-full w-full items-center justify-center"
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: CARD_TEXT_DARK,
                opacity: 0.35,
              }}
            >
              {SAMPLE.initials}
            </span>
            {/* Bottom fade */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0"
              style={{
                height: 50,
                background:
                  "linear-gradient(to top, rgba(139, 114, 50, 0.5), rgba(139, 114, 50, 0))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div
        className="mx-auto"
        style={{
          width: "70%",
          height: 1,
          backgroundColor: "rgba(44, 24, 16, 0.2)",
        }}
      />

      {/* Name band */}
      <div
        className="flex w-full flex-col items-center"
        style={{
          background: `linear-gradient(90deg, rgba(184,148,64,0), ${CARD_NAME_BAND}, ${CARD_NAME_BAND}, rgba(184,148,64,0))`,
          padding: "8px 0 6px",
        }}
      >
        <span
          className="text-center"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: CARD_NAME_TEXT,
            letterSpacing: 3,
          }}
        >
          {SAMPLE.name}
        </span>
      </div>

      {/* Role + Company */}
      <span
        className="block text-center"
        style={{
          fontSize: 10,
          fontWeight: 400,
          color: "rgba(44, 24, 16, 0.5)",
          marginTop: 2,
        }}
      >
        {SAMPLE.role} &middot; {SAMPLE.company}
      </span>

      {/* Stats grid */}
      <div
        className="mx-auto flex flex-col"
        style={{
          width: "90%",
          marginTop: 6,
          borderTop: "1px solid rgba(44, 24, 16, 0.15)",
        }}
      >
        {/* Row 1 */}
        <div
          className="flex items-center justify-center"
          style={{ padding: "8px 0 6px" }}
        >
          {SAMPLE.skills.slice(0, 3).map((skill, i) => (
            <div key={i} className="flex items-center">
              <StatCell label={skill.label} score={skill.score} />
              {i < 2 && <Divider />}
            </div>
          ))}
        </div>

        {/* Horizontal divider */}
        <div
          className="self-center"
          style={{
            width: "75%",
            height: 1,
            backgroundColor: "rgba(44, 24, 16, 0.1)",
          }}
        />

        {/* Row 2 */}
        <div
          className="flex items-center justify-center"
          style={{ padding: "6px 0 8px" }}
        >
          {SAMPLE.skills.slice(3, 6).map((skill, i) => (
            <div key={i} className="flex items-center">
              <StatCell label={skill.label} score={skill.score} />
              {i < 2 && <Divider />}
            </div>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <div className="mt-1.5 flex w-full justify-center pb-2">
        <span
          style={{
            fontSize: 6,
            color: "rgba(44, 24, 16, 0.15)",
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          LinkedIn FC
        </span>
      </div>
    </div>
  );
}

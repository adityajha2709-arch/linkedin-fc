import type { SkillEntry } from "@/types/profile";

interface SkillsRadarProps {
  skills: SkillEntry[];
}

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 110;
const LABEL_OFFSET = 30;
const GRID_LEVELS = [0.25, 0.5, 0.75, 1];
const ACCENT = "#D4A843";

function getPoint(
  index: number,
  total: number,
  radius: number
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

function polygonPoints(count: number, radius: number): string {
  return Array.from({ length: count }, (_, i) => {
    const p = getPoint(i, count, radius);
    return `${p.x},${p.y}`;
  }).join(" ");
}

function getScoreColor(score: number): string {
  if (score >= 85) return "#FFD700";
  if (score >= 70) return "#D4A843";
  if (score >= 50) return "#B8922E";
  return "#8B6914";
}

export default function SkillsRadar({ skills }: SkillsRadarProps) {
  if (skills.length === 0) return null;

  const count = skills.length;

  return (
    <section>
      <h2 className="section-header mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-primary">
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-4 w-3"
            style={{
              background: "#D4A843",
              clipPath:
                "polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)",
            }}
          />
          Player Traits
        </span>
      </h2>
      <div className="fifa-card p-4 sm:p-5">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-[280px]">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(212,168,67,0.04)" />
              <stop offset="100%" stopColor="rgba(212,168,67,0)" />
            </radialGradient>
          </defs>

          {/* Subtle radial glow behind chart */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#radarBg)" />

          {/* Grid hexagons */}
          {GRID_LEVELS.map((level) => (
            <polygon
              key={level}
              points={polygonPoints(count, RADIUS * level)}
              fill="none"
              stroke="rgba(212,168,67,0.08)"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {skills.map((_, i) => {
            const p = getPoint(i, count, RADIUS);
            return (
              <line
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={p.x}
                y2={p.y}
                stroke="rgba(212,168,67,0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <polygon
            points={skills
              .map((skill, i) => {
                const p = getPoint(i, count, RADIUS * (skill.score / 99));
                return `${p.x},${p.y}`;
              })
              .join(" ")}
            fill={`${ACCENT}25`}
            stroke={ACCENT}
            strokeWidth="2.5"
            filter="url(#glow)"
          />

          {/* Data points */}
          {skills.map((skill, i) => {
            const p = getPoint(i, count, RADIUS * (skill.score / 99));
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                fill={ACCENT}
                stroke="#0a1628"
                strokeWidth="1.5"
                filter="url(#glow)"
              />
            );
          })}

          {/* Score labels */}
          {skills.map((skill, i) => {
            const p = getPoint(i, count, RADIUS + 16);
            return (
              <text
                key={`score-${i}`}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={getScoreColor(skill.score)}
                fontSize="13"
                fontWeight="800"
              >
                {skill.score}
              </text>
            );
          })}

          {/* Skill name labels */}
          {skills.map((skill, i) => {
            const p = getPoint(i, count, RADIUS + LABEL_OFFSET);
            return (
              <text
                key={`label-${i}`}
                x={p.x}
                y={p.y + 14}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(212,168,67,0.5)"
                fontSize="9"
                fontWeight="500"
              >
                {skill.label.toUpperCase()}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

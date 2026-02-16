import type { SkillEntry } from "@/types/profile";

interface SkillsRadarProps {
  skills: SkillEntry[];
}

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 110;
const LABEL_OFFSET = 30;
const GRID_LEVELS = [0.25, 0.5, 0.75, 1];
const ACCENT = "#00e676";

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
  if (score >= 85) return "#00e676";
  if (score >= 70) return "#f5c518";
  if (score >= 50) return "#ff9800";
  return "#ef4444";
}

export default function SkillsRadar({ skills }: SkillsRadarProps) {
  if (skills.length === 0) return null;

  const count = skills.length;

  return (
    <section>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">
        Player Traits
      </h2>
      <div className="rounded-2xl border border-white/[0.06] bg-card-bg p-4 sm:p-5">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-[280px]">
          {/* Grid hexagons */}
          {GRID_LEVELS.map((level) => (
            <polygon
              key={level}
              points={polygonPoints(count, RADIUS * level)}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
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
                stroke="rgba(255,255,255,0.06)"
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
            fill={`${ACCENT}20`}
            stroke={ACCENT}
            strokeWidth="2"
          />

          {/* Data points */}
          {skills.map((skill, i) => {
            const p = getPoint(i, count, RADIUS * (skill.score / 99));
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3"
                fill={ACCENT}
              />
            );
          })}

          {/* Score labels (inside, near data points) */}
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

          {/* Skill name labels (outside) */}
          {skills.map((skill, i) => {
            const p = getPoint(i, count, RADIUS + LABEL_OFFSET);
            return (
              <text
                key={`label-${i}`}
                x={p.x}
                y={p.y + 14}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#8b8b8e"
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

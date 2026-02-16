import type { SkillEntry } from "@/types/profile";

interface SkillsDisplayProps {
  skills: SkillEntry[];
}

function getScoreColor(score: number): string {
  if (score >= 85) return "#00e676";
  if (score >= 70) return "#f5c518";
  if (score >= 50) return "#ff9800";
  return "#ef4444";
}

export default function SkillsDisplay({ skills }: SkillsDisplayProps) {
  if (skills.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">
        Attributes
      </h2>
      <div className="rounded-2xl border border-white/[0.06] bg-card-bg p-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="text-2xl font-black tabular-nums"
                style={{ color: getScoreColor(skill.score) }}
              >
                {skill.score}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  {skill.label}
                </span>
                <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(skill.score / 99) * 100}%`,
                      backgroundColor: getScoreColor(skill.score),
                      opacity: 0.6,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

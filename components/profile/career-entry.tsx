import type { CareerEntry as CareerEntryType } from "@/types/profile";
import { calculateDuration } from "@/lib/date-utils";

export interface CompanyGroup {
  company: string;
  roles: CareerEntryType[];
  isCurrent: boolean;
  earliestStart: string;
  latestEnd: string;
  totalDuration: string;
}

interface CompanyGroupCardProps {
  group: CompanyGroup;
}

const BADGE_COLORS = [
  "#D4A843", "#FFD700", "#a8b4c0", "#C9A84C", "#34d399",
  "#ff9800", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
];

function getBadgeColor(company: string): string {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BADGE_COLORS[Math.abs(hash) % BADGE_COLORS.length];
}

export default function CompanyGroupCard({ group }: CompanyGroupCardProps) {
  const badgeColor = getBadgeColor(group.company);
  const initial = group.company.charAt(0).toUpperCase();

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(165deg, #0f1f2e 0%, ${badgeColor}05 100%)`,
        border: "1px solid rgba(212,168,67,0.10)",
        borderLeftWidth: "3px",
        borderLeftColor: group.isCurrent ? "#D4A843" : "rgba(212,168,67,0.10)",
        boxShadow: group.isCurrent
          ? "0 0 20px rgba(212,168,67,0.08), inset 0 1px 0 rgba(212,168,67,0.06)"
          : "inset 0 1px 0 rgba(212,168,67,0.03)",
      }}
    >
      <div className="p-4 sm:p-5">
        {/* Company header row */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center text-sm font-black"
            style={{
              backgroundColor: badgeColor,
              color: "#0a1628",
              clipPath:
                "polygon(50% 0%, 100% 12%, 100% 75%, 50% 100%, 0% 75%, 0% 12%)",
            }}
          >
            {initial}
          </div>

          <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-bold text-white truncate">{group.company}</h3>
              {group.isCurrent && (
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(212,168,67,0.15)",
                    color: "#D4A843",
                  }}
                >
                  Current
                </span>
              )}
            </div>
            <span className="shrink-0 text-sm font-bold tabular-nums" style={{ color: "#D4A843" }}>
              {group.totalDuration}
            </span>
          </div>
        </div>

        {/* Date range */}
        <div className="ml-[52px] mt-1">
          <span className="text-xs text-text-tertiary">
            {group.earliestStart} – {group.latestEnd}
          </span>
        </div>

        {/* Gold divider */}
        {group.roles.length > 0 && (
          <div
            className="ml-[52px] mt-3 mb-2 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(212,168,67,0.15), transparent)",
            }}
          />
        )}

        {/* Roles list */}
        {group.roles.length > 0 && (
          <div className="ml-[52px] flex flex-col gap-1.5">
            {group.roles.map((role, i) => {
              const duration = calculateDuration(role.startDate, role.endDate);
              return (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "rgba(212,168,67,0.4)" }}
                    />
                    <span className="text-sm text-text-secondary truncate">
                      {role.title}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-baseline gap-2">
                    {duration && (
                      <span className="text-xs text-text-tertiary">{duration}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

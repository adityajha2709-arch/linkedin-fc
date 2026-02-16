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
  "#00e676", "#f5c518", "#a8b4c0", "#c47e2c", "#34d399",
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
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card-bg"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: group.isCurrent ? "#00e676" : "transparent",
        boxShadow: group.isCurrent ? "0 0 20px rgba(0,230,118,0.06)" : undefined,
      }}
    >
      <div className="p-4 sm:p-5">
        {/* Company header row */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-black"
            style={{ backgroundColor: badgeColor }}
          >
            {initial}
          </div>

          <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-bold text-white truncate">{group.company}</h3>
              {group.isCurrent && (
                <span className="shrink-0 rounded-full bg-accent-dim px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                  Current
                </span>
              )}
            </div>
            <span className="shrink-0 text-sm font-bold text-gold tabular-nums">
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

        {/* Roles list */}
        {group.roles.length > 0 && (
          <div className="ml-[52px] mt-3 flex flex-col gap-1.5">
            {group.roles.map((role, i) => {
              const duration = calculateDuration(role.startDate, role.endDate);
              return (
                <div key={i} className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-text-tertiary">·</span>
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

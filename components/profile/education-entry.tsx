import type { EducationEntry as EducationEntryType } from "@/types/profile";
import { formatYearRange } from "@/lib/date-utils";

interface EducationEntryProps {
  entry: EducationEntryType;
}

export default function EducationEntry({ entry }: EducationEntryProps) {
  const yearRange = formatYearRange(entry.startYear, entry.endYear);
  const initial = entry.institution.charAt(0).toUpperCase();

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-card-bg" style={{ borderLeftWidth: "4px", borderLeftColor: "#2d6a4f" }}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Institution initial badge */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pitch-green-light text-sm font-bold text-white">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white">{entry.institution}</h3>
            <p className="mt-0.5 text-sm text-text-secondary">{entry.degree}</p>
            {yearRange && (
              <p className="mt-1 text-xs text-text-tertiary">{yearRange}</p>
            )}
            {entry.description && (
              <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                {entry.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

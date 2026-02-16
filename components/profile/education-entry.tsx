import type { EducationEntry as EducationEntryType } from "@/types/profile";
import { formatYearRange } from "@/lib/date-utils";

interface EducationEntryProps {
  entry: EducationEntryType;
}

export default function EducationEntry({ entry }: EducationEntryProps) {
  const yearRange = formatYearRange(entry.startYear, entry.endYear);
  const initial = entry.institution.charAt(0).toUpperCase();

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(165deg, #0f1f2e 0%, #0d2818 100%)",
        border: "1px solid rgba(212,168,67,0.10)",
        borderLeftWidth: "3px",
        borderLeftColor: "#1a5c35",
        boxShadow: "inset 0 1px 0 rgba(212,168,67,0.03)",
      }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Institution initial badge — shield shape */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold text-white"
            style={{
              backgroundColor: "#1a5c35",
              clipPath:
                "polygon(50% 0%, 100% 12%, 100% 75%, 50% 100%, 0% 75%, 0% 12%)",
            }}
          >
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

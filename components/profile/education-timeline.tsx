import type { EducationEntry as EducationEntryType } from "@/types/profile";
import EducationEntry from "./education-entry";

interface EducationTimelineProps {
  entries: EducationEntryType[];
}

export default function EducationTimeline({ entries }: EducationTimelineProps) {
  if (entries.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">
        Youth Development
      </h2>
      <div className="flex flex-col gap-3">
        {entries.map((entry, i) => (
          <EducationEntry key={i} entry={entry} />
        ))}
      </div>
    </section>
  );
}

import type { EducationEntry as EducationEntryType } from "@/types/profile";
import EducationEntry from "./education-entry";

interface EducationTimelineProps {
  entries: EducationEntryType[];
}

export default function EducationTimeline({ entries }: EducationTimelineProps) {
  if (entries.length === 0) return null;

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
          Youth Development
        </span>
      </h2>
      <div className="flex flex-col gap-3">
        {entries.map((entry, i) => (
          <EducationEntry key={i} entry={entry} />
        ))}
      </div>
    </section>
  );
}

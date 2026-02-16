import type { CareerEntry as CareerEntryType } from "@/types/profile";
import { calculateDuration } from "@/lib/date-utils";
import CompanyGroupCard, { type CompanyGroup } from "./career-entry";

interface CareerTimelineProps {
  entries: CareerEntryType[];
}

function groupByCompany(entries: CareerEntryType[]): CompanyGroup[] {
  const groupMap = new Map<string, CareerEntryType[]>();
  const order: string[] = [];

  for (const entry of entries) {
    const key = entry.company;
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
      order.push(key);
    }
    groupMap.get(key)!.push(entry);
  }

  return order.map((company) => {
    const roles = groupMap.get(company)!;
    const isCurrent = roles.some((r) => {
      const end = r.endDate.trim().toLowerCase();
      return end === "present" || end === "current";
    });

    // Find earliest start and latest end
    const earliestStart = roles[roles.length - 1].startDate;
    const latestEnd = roles[0].endDate;
    const totalDuration = calculateDuration(earliestStart, latestEnd);

    return {
      company,
      roles,
      isCurrent,
      earliestStart,
      latestEnd,
      totalDuration,
    };
  });
}

export default function CareerTimeline({ entries }: CareerTimelineProps) {
  if (entries.length === 0) return null;

  const groups = groupByCompany(entries);

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
          Club Career
        </span>
      </h2>
      <div className="flex flex-col gap-3">
        {groups.map((group, i) => (
          <CompanyGroupCard key={i} group={group} />
        ))}
      </div>
    </section>
  );
}

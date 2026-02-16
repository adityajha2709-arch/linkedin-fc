interface ProfileSummaryProps {
  summary: string;
}

export default function ProfileSummary({ summary }: ProfileSummaryProps) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">
        Scouting Report
      </h2>
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card-bg p-5 sm:p-6">
        {/* Gradient top accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-pitch-green-light via-accent to-transparent" />

        {/* Decorative quote mark */}
        <span className="absolute left-4 top-3 text-5xl font-serif leading-none text-white/[0.04] sm:text-6xl">
          &ldquo;
        </span>

        <p className="relative text-base leading-relaxed text-text-secondary">
          {summary}
        </p>
      </div>
    </section>
  );
}

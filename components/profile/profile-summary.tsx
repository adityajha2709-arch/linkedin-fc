interface ProfileSummaryProps {
  summary: string;
}

export default function ProfileSummary({ summary }: ProfileSummaryProps) {
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
          Scouting Report
        </span>
      </h2>
      <div
        className="dossier-bg relative overflow-hidden rounded-2xl p-5 sm:p-6"
        style={{
          border: "1px solid rgba(212,168,67,0.12)",
          boxShadow:
            "0 0 0 1px rgba(212,168,67,0.04), 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(212,168,67,0.06)",
        }}
      >
        {/* Gold top accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold-dark via-gold-primary to-transparent" />

        {/* CLASSIFIED watermark */}
        <span className="absolute right-4 top-3 text-[10px] font-black uppercase tracking-[0.3em] text-gold-primary/[0.08] sm:text-xs">
          Classified
        </span>

        {/* Decorative quote mark */}
        <span className="absolute left-4 top-3 text-5xl font-serif leading-none text-gold-primary/[0.06] sm:text-6xl">
          &ldquo;
        </span>

        {/* Summary with gold left border */}
        <div
          className="relative ml-1 border-l-2 pl-4"
          style={{ borderColor: "rgba(212,168,67,0.15)" }}
        >
          <p className="text-base leading-relaxed text-text-secondary">
            {summary}
          </p>
        </div>
      </div>
    </section>
  );
}

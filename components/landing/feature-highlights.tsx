const features = [
  {
    title: "AI-Powered",
    description: "Claude AI reads your PDF and extracts career data automatically",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M16 14h.01" />
        <path d="M8 14h.01" />
        <path d="M12 18v4" />
        <path d="M7 22h10" />
        <path d="M6 14a6 6 0 0 0 12 0" />
      </svg>
    ),
  },
  {
    title: "FIFA Card Style",
    description: "Your career stats rendered as a premium football card",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    title: "Instant Download",
    description: "Download as PNG, perfect for LinkedIn profile pictures",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
];

export default function FeatureHighlights() {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
      {features.map((f) => (
        <div
          key={f.title}
          className="flex flex-col items-center gap-2 rounded-xl border border-accent/10 bg-card-bg p-5 text-center transition-shadow hover:shadow-[0_0_20px_rgba(196,169,98,0.08)]"
          style={{
            borderTop: "2px solid rgba(196, 169, 98, 0.4)",
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
            {f.icon}
          </div>
          <p className="text-xs font-semibold text-white">{f.title}</p>
          <p className="text-[11px] leading-relaxed text-text-tertiary">
            {f.description}
          </p>
        </div>
      ))}
    </div>
  );
}

const steps = [
  {
    number: 1,
    title: "Go to your profile",
    detail: "Open LinkedIn and navigate to your profile page",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text-secondary"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Click More (\u22EF)",
    detail: "Find the \u22EF button below your profile header",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text-secondary"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Save to PDF",
    detail: "Select \u2018Save to PDF\u2019 to download your career dossier",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text-secondary"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
];

export default function ExportSteps() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
          Your Game Plan
        </p>
        <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
      </div>

      {/* Tactical board container */}
      <div className="animate-fade-in-up tactical-card relative mt-4 rounded-xl px-6 py-6 sm:px-8">
        {/* Dashed connecting line — desktop only */}
        <div
          className="pointer-events-none absolute hidden sm:block"
          style={{
            left: "16.67%",
            right: "16.67%",
            top: 51,
            height: 0,
            borderTop: "1px dashed rgba(26, 92, 53, 0.4)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-start gap-4 sm:flex-1 sm:flex-col sm:items-center sm:gap-3 sm:text-center">
              {/* Number circle */}
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-pitch-green-light/40 bg-pitch-green/30 text-sm font-bold text-accent">
                  {step.number}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                  {step.icon}
                </div>
              </div>

              {/* Text */}
              <div className="pt-1 sm:pt-0">
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-0.5 text-xs text-text-tertiary">
                  {step.detail}
                </p>
              </div>

              {/* Arrow between steps — mobile vertical */}
              {i < steps.length - 1 && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="hidden text-accent/30"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

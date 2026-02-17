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
    detail: "Select \u2018Save to PDF\u2019 from the dropdown menu",
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
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
        How to Export
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="animate-fade-in-up relative flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-card-bg p-5 text-center"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-bold text-accent">
              {step.number}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
              {step.icon}
            </div>
            <p className="text-sm font-semibold text-white">{step.title}</p>
            <p className="text-xs text-text-tertiary">{step.detail}</p>

            {i < steps.length - 1 && (
              <div className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-text-tertiary sm:block">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

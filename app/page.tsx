import PdfUploader from "@/components/landing/pdf-uploader";
import ExportSteps from "@/components/landing/export-steps";
import FeatureHighlights from "@/components/landing/feature-highlights";
import SampleCardPreview from "@/components/landing/sample-card-preview";

export default function Home() {
  return (
    <div className="stadium-bg pitch-texture relative flex min-h-screen flex-col items-center px-4 pb-12">
      {/* Stadium spotlight effects — layered decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Stadium floodlight glow */}
        <div className="stadium-light absolute inset-0" />
        {/* Floodlight sweep (separate div to avoid ::before conflict with pitch-texture) */}
        <div className="floodlight-sweep absolute inset-0" />
        {/* Warm gold glow from left */}
        <div className="absolute left-0 top-0 h-[600px] w-[400px] bg-gradient-to-br from-accent/[0.04] to-transparent blur-3xl" />
        {/* Green pitch glow from right */}
        <div className="absolute right-0 top-1/4 h-[400px] w-[300px] bg-gradient-to-bl from-pitch-green/[0.08] to-transparent blur-3xl" />
        {/* Hex texture overlay */}
        <div className="hex-texture absolute inset-0 opacity-50" />
      </div>

      <main className="relative z-10 flex w-full flex-col items-center gap-16 pt-16 sm:pt-24">
        {/* ===== HERO SECTION ===== */}
        <div className="w-full max-w-5xl">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            {/* Left: Title + Upload */}
            <div className="flex flex-col items-center text-center lg:flex-1 lg:items-start lg:text-left">
              {/* Club crest / match-day header */}
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/60">
                  Career Card Generator
                </p>
                <h1 className="mt-2 text-5xl font-black uppercase tracking-tight text-white sm:text-6xl">
                  LinkedIn{" "}
                  <span
                    className="text-accent"
                    style={{
                      textShadow: "0 0 40px rgba(196, 169, 98, 0.3)",
                    }}
                  >
                    FC
                  </span>
                </h1>
                {/* Gold underline decoration */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-0.5 w-8 bg-accent/60" />
                  <div className="h-1 w-1 rounded-full bg-accent/40" />
                  <div className="h-0.5 w-16 bg-gradient-to-r from-accent/60 to-transparent" />
                </div>
              </div>

              <p className="mt-4 text-lg font-medium text-text-secondary">
                Turn your career into a football card
              </p>
              <p className="mt-1.5 text-sm text-text-tertiary">
                Upload your LinkedIn PDF and get a FIFA-style career card in
                seconds
              </p>

              <div className="mt-8 w-full max-w-md">
                <PdfUploader />
              </div>
            </div>

            {/* Right: Sample card with glow + float — desktop only */}
            <div className="hidden lg:flex lg:shrink-0 lg:items-center lg:justify-center">
              {/* Glow container */}
              <div className="card-glow relative" style={{ padding: 20 }}>
                {/* Ambient glow behind card */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(196, 169, 98, 0.15) 0%, transparent 70%)",
                  }}
                />
                {/* Floating card */}
                <div
                  className="card-float relative"
                  style={{
                    transform: "scale(0.65)",
                    transformOrigin: "center center",
                  }}
                >
                  <SampleCardPreview />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== FOOTBALL-THEMED DIVIDER ===== */}
        <div className="w-full max-w-lg">
          <div className="section-divider-football">
            <div className="ball" />
          </div>
        </div>

        {/* ===== BELOW HERO — Instructions & Features ===== */}
        <div className="flex w-full max-w-lg flex-col items-center gap-12">
          {/* Export steps — tactical instructions */}
          <ExportSteps />

          {/* Feature highlights — club perks */}
          <FeatureHighlights />

          {/* Notices */}
          <div className="flex w-full flex-col gap-3 text-center">
            <div className="flex items-start gap-2 rounded-xl border border-accent/10 bg-accent/[0.03] px-4 py-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0 text-accent"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <p className="text-left text-xs text-text-tertiary">
                For best experience, open LinkedIn in your desktop browser or
                use desktop mode on mobile browser to download your PDF.
              </p>
            </div>
            <p className="text-xs text-text-tertiary">
              The quality of your card depends on how detailed your LinkedIn
              profile is.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center">
        <div className="mx-auto mb-4 h-px w-32 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-tertiary/50">
          LinkedIn FC
        </p>
      </footer>
    </div>
  );
}

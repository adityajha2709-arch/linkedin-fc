import PdfUploader from "@/components/landing/pdf-uploader";
import ExportSteps from "@/components/landing/export-steps";
import FeatureHighlights from "@/components/landing/feature-highlights";
import SampleCardPreview from "@/components/landing/sample-card-preview";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-surface px-4 pb-12">
      {/* Background radial glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.03] blur-3xl" />
        <div className="absolute left-1/4 top-3/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.02] blur-3xl" />
      </div>

      <main className="relative flex w-full flex-col items-center gap-10 pt-16 sm:pt-24">
        {/* Hero — wider container for side-by-side layout */}
        <div className="w-full max-w-4xl">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            {/* Left: text + uploader */}
            <div className="flex flex-col items-center text-center lg:flex-1 lg:items-start lg:text-left">
              <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
                LinkedIn <span className="text-accent">FC</span>
              </h1>
              <p className="mt-3 text-lg text-text-secondary">
                Turn your career into a football card
              </p>
              <p className="mt-2 text-sm text-text-tertiary">
                Upload your LinkedIn PDF and get a FIFA-style career card in
                seconds
              </p>
              <div className="mt-8 w-full max-w-md">
                <PdfUploader />
              </div>
            </div>

            {/* Right: sample card preview — desktop only */}
            <div
              className="hidden lg:flex lg:shrink-0 lg:items-center lg:justify-center"
              style={{ width: 260, height: 345 }}
            >
              <div
                style={{
                  transform: "scale(0.62) rotate(-2deg)",
                  transformOrigin: "center center",
                }}
              >
                <SampleCardPreview />
              </div>
            </div>
          </div>
        </div>

        {/* Below hero — narrower container */}
        <div className="flex w-full max-w-lg flex-col items-center gap-10">
          {/* How to export steps */}
          <ExportSteps />

          {/* Feature highlights */}
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
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-tertiary/50">
          LinkedIn FC
        </p>
      </footer>
    </div>
  );
}

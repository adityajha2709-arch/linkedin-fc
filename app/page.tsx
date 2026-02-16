import PdfUploader from "@/components/landing/pdf-uploader";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-4">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.03] blur-3xl" />
      </div>

      <main className="relative flex w-full max-w-md flex-col items-center gap-10 py-16">
        {/* Logo / Title */}
        <div className="text-center">
          <h1 className="text-5xl font-black tracking-tight text-white">
            LinkedIn <span className="text-accent">FC</span>
          </h1>
          <p className="mt-3 text-base text-text-secondary">
            Turn your career into a football card
          </p>
        </div>

        {/* Upload */}
        <div className="w-full">
          <PdfUploader />
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-text-tertiary">
          <p>Export your LinkedIn profile as PDF, then upload it here.</p>
          <p className="mt-1">
            Go to your LinkedIn profile &rarr; More &rarr; Save to PDF
          </p>
        </div>
      </main>
    </div>
  );
}

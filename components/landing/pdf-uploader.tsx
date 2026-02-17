"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile-context";
import type { ParsePdfResponse, ParsePdfErrorResponse } from "@/types/profile";

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_FILE_TYPE: "Please upload a PDF file. Other file types aren't supported.",
  FILE_TOO_LARGE: "This file exceeds the 10 MB limit. Try a smaller PDF.",
  NO_FILE_PROVIDED: "No file was detected. Please try selecting your PDF again.",
  PARSE_FAILED:
    "We couldn't extract profile data from this PDF. Make sure it's a LinkedIn profile export.",
  INVALID_RESPONSE:
    "The data extracted from this PDF was incomplete. Please try a different export.",
  API_ERROR: "Our AI service is temporarily unavailable. Please try again shortly.",
};

export default function PdfUploader() {
  const router = useRouter();
  const { setProfileData } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateToProfile = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    router.push("/profile");
  }, [router]);

  useEffect(() => {
    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, []);

  async function handleFile(file: File) {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      const json = (await res.json()) as ParsePdfResponse | ParsePdfErrorResponse;

      if (json.success) {
        setProfileData(json.data);

        if (json.warnings && json.warnings.length > 0) {
          setWarning(json.warnings.map((w) => w.message).join(" "));
          warningTimerRef.current = setTimeout(navigateToProfile, 3000);
        } else {
          router.push("/profile");
        }
      } else {
        const code = json.error.code;
        setError(ERROR_MESSAGES[code] || json.error.error);
      }
    } catch {
      setError("Unable to connect. Please check your internet connection and try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  if (isUploading) {
    return (
      <div className="registration-border flex flex-col items-center justify-center gap-4 rounded-xl bg-card-bg/80 p-10">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-accent" />
        <p className="text-base font-bold uppercase tracking-wide text-white">Scouting your profile...</p>
        <p className="text-sm text-text-tertiary">Analyzing career stats and performance data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        className={`registration-border flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl p-10 transition-all ${
          isDragging
            ? "bg-pitch-green/20 shadow-[0_0_40px_rgba(196,169,98,0.15)]"
            : "bg-card-bg/80 hover:bg-card-bg hover:shadow-[0_0_30px_rgba(196,169,98,0.08)]"
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/60">
          Player Registration
        </p>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/20 bg-accent/[0.06]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent/70"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-base font-bold uppercase tracking-wide text-white">
            Upload your LinkedIn PDF
          </p>
          <p className="mt-1 text-sm text-text-tertiary">
            Drag & drop your profile or click to select
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {/* LinkedIn export steps */}
      <div className="flex flex-col items-center gap-2 py-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/50">
          Don&apos;t have a PDF yet?
        </p>
        <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[9px] font-bold text-accent">1</span>
            <a
              href="https://www.linkedin.com/in/me/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent/60"
            >
              Go to your profile
            </a>
          </span>
          <span className="text-accent/30">&rarr;</span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[9px] font-bold text-accent">2</span>
            Click <span className="font-semibold text-text-secondary">More (&hellip;)</span>
          </span>
          <span className="text-accent/30">&rarr;</span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[9px] font-bold text-accent">3</span>
            <span className="font-semibold text-text-secondary">Save to PDF</span>
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-error/20 bg-error/5 p-4 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0 text-error"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-text-secondary">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs font-bold uppercase tracking-wider text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {warning && (
        <div className="flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent/5 p-4 shadow-[0_0_20px_rgba(196,169,98,0.05)]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0 text-accent"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-text-secondary">{warning}</p>
            <button
              onClick={navigateToProfile}
              className="mt-2 text-xs font-bold uppercase tracking-wider text-accent hover:underline"
            >
              Continue now &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

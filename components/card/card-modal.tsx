"use client";

import { useState, useEffect, useCallback } from "react";
import { useProfile } from "@/lib/profile-context";
import FcCard from "./fc-card";
import type { CardData } from "@/types/profile";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function resizePhoto(dataUrl: string, maxSize: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}

export default function CardModal({ isOpen, onClose }: CardModalProps) {
  const { profileData, photoOverride } = useProfile();

  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize card data from profile when modal opens
  useEffect(() => {
    if (isOpen && profileData) {
      setCardData({
        name: profileData.name,
        photo: photoOverride ?? profileData.photo ?? null,
        currentRole: profileData.currentRole,
        currentCompany: profileData.currentCompany,
        overallRating: profileData.overallRating,
        skills: [...profileData.skills],
      });
      setError(null);
    }
  }, [isOpen, profileData, photoOverride]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleDownload = useCallback(async () => {
    if (!cardData) return;
    setIsDownloading(true);
    setError(null);

    try {
      // Resize photo before sending to reduce payload
      const dataToSend = { ...cardData };
      if (dataToSend.photo) {
        dataToSend.photo = await resizePhoto(dataToSend.photo, 300);
      }

      const res = await fetch("/api/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardData: dataToSend }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cardData.name.replace(/\s+/g, "_")}_linkedin_fc.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate card. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  }, [cardData]);

  if (!isOpen || !cardData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Card */}
        <FcCard cardData={cardData} onCardDataChange={setCardData} />

        {/* Error message */}
        {error && (
          <p className="text-sm" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 rounded-2xl px-8 py-3 text-sm font-bold uppercase tracking-wide transition-all hover:scale-[1.02]"
          style={{
            background: isDownloading
              ? "rgba(212, 168, 67, 0.4)"
              : "linear-gradient(135deg, #D4A843 0%, #B8922E 50%, #D4A843 100%)",
            color: "#0a1628",
            boxShadow: isDownloading
              ? "none"
              : "0 0 20px rgba(212,168,67,0.3), 0 4px 12px rgba(0,0,0,0.3)",
            cursor: isDownloading ? "not-allowed" : "pointer",
          }}
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PNG
            </>
          )}
        </button>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          Click the pencil icon to edit skills and photo
        </p>
      </div>
    </div>
  );
}

"use client";

import { useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { MAX_PHOTO_SIZE_BYTES } from "@/config/constants";

interface PhotoUploadProps {
  photo: string | null;
  onPhotoUpload: (dataUrl: string) => void;
  glowColor?: string;
}

export default function PhotoUpload({
  photo,
  onPhotoUpload,
  glowColor = "#D4A843",
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_PHOTO_SIZE_BYTES) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onPhotoUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`group relative h-[100px] w-[100px] overflow-hidden rounded-full sm:h-[140px] sm:w-[140px] ${
          !photo ? "border-2 border-dashed border-text-tertiary/50" : ""
        }`}
        style={{
          boxShadow: photo
            ? `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`
            : `0 0 15px ${glowColor}30, 0 0 30px ${glowColor}15`,
          animation: !photo ? "photo-spotlight 2s ease-in-out infinite" : undefined,
        }}
      >
        {/* Ring border — only when photo exists */}
        {photo && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              padding: "3px",
              background: `linear-gradient(135deg, ${glowColor}, ${glowColor}80)`,
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        )}

        {photo ? (
          <Image
            src={photo}
            alt="Profile photo"
            fill
            className="rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center rounded-full bg-card-bg-light"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-tertiary sm:h-[44px] sm:w-[44px]"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/40">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
      </button>

      {!photo && (
        <div className="mt-1 flex flex-col items-center">
          <span className="text-[8px] leading-none text-accent/50">&#9650;</span>
          <div className="rounded-md border border-accent/15 bg-accent/[0.08] px-2.5 py-1.5">
            <p className="text-center text-[10px] font-medium text-accent/80">
              Add your photo for the best card
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

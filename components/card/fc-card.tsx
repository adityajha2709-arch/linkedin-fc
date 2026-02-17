"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import type { CardData } from "@/types/profile";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  SKILL_SCORE_MIN,
  SKILL_SCORE_MAX,
  MAX_PHOTO_SIZE_BYTES,
} from "@/config/constants";

interface FcCardProps {
  cardData: CardData;
  onCardDataChange: (updated: CardData) => void;
}

function derivePosition(role: string): string {
  const lower = role.toLowerCase();
  if (/ceo|founder|chief|president|owner/.test(lower)) return "GK";
  if (/director|vp|head/.test(lower)) return "CB";
  if (/manager|lead|principal/.test(lower)) return "CDM";
  if (/design|ux|ui|creative/.test(lower)) return "CAM";
  if (/data|analy|research|scien/.test(lower)) return "CM";
  if (/engineer|develop|program|software/.test(lower)) return "CM";
  if (/market|growth|brand/.test(lower)) return "RW";
  if (/sales|business dev|account/.test(lower)) return "ST";
  if (/consult|advis/.test(lower)) return "CF";
  if (/product/.test(lower)) return "AM";
  return "CM";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function FcCard({ cardData, onCardDataChange }: FcCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const pos = derivePosition(cardData.currentRole);
  const initials = getInitials(cardData.name);

  function handleSkillLabelChange(index: number, label: string) {
    const updated = { ...cardData, skills: [...cardData.skills] };
    updated.skills[index] = { ...updated.skills[index], label };
    onCardDataChange(updated);
  }

  function handleSkillScoreChange(index: number, value: string) {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    const clamped = Math.min(SKILL_SCORE_MAX, Math.max(SKILL_SCORE_MIN, num));
    const updated = { ...cardData, skills: [...cardData.skills] };
    updated.skills[index] = { ...updated.skills[index], score: clamped };
    onCardDataChange(updated);
  }

  function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_PHOTO_SIZE_BYTES) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onCardDataChange({ ...cardData, photo: reader.result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="relative" style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
      {/* Edit toggle */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute -right-12 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
        style={{
          backgroundColor: isEditing ? "#D4A843" : "rgba(255,255,255,0.1)",
          color: isEditing ? "#0a1628" : "#D4A843",
        }}
        title={isEditing ? "Done editing" : "Edit card"}
      >
        {isEditing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        )}
      </button>

      {/* Card body */}
      <div
        className="relative flex flex-col items-center overflow-hidden"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: "linear-gradient(165deg, #D4A843 0%, #B8922E 50%, #8B6914 100%)",
          borderRadius: 20,
          padding: "28px 24px 16px",
        }}
      >
        {/* Inner border */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
            borderRadius: 14,
            border: "1px solid rgba(10, 22, 40, 0.12)",
          }}
        />

        {/* Top: Rating + Photo */}
        <div className="mt-2 flex w-full items-start justify-center gap-6">
          {/* Rating + Position */}
          <div className="mt-4 flex flex-col items-center">
            <span
              className="leading-none"
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: "#0a1628",
              }}
            >
              {cardData.overallRating}
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#0a1628",
                letterSpacing: 3,
                marginTop: 4,
              }}
            >
              {pos}
            </span>
          </div>

          {/* Photo */}
          <button
            type="button"
            onClick={() => isEditing && photoInputRef.current?.click()}
            className="group relative overflow-hidden"
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              border: "3px solid #0a1628",
              backgroundColor: "rgba(10, 22, 40, 0.15)",
              cursor: isEditing ? "pointer" : "default",
            }}
            disabled={!isEditing}
          >
            {cardData.photo ? (
              <Image
                src={cardData.photo}
                alt="Player photo"
                fill
                className="object-cover"
                unoptimized
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <span
                className="flex h-full w-full items-center justify-center"
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: "#0a1628",
                  opacity: 0.6,
                }}
              >
                {initials}
              </span>
            )}

            {/* Edit overlay */}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/30">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            )}
          </button>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Name */}
        <span
          className="mt-4 text-center"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#0a1628",
            letterSpacing: 1,
          }}
        >
          {cardData.name.toUpperCase()}
        </span>

        {/* Role + Company */}
        <span
          className="mt-1 text-center"
          style={{
            fontSize: 11,
            fontWeight: 400,
            color: "rgba(10, 22, 40, 0.55)",
          }}
        >
          {cardData.currentRole} · {cardData.currentCompany}
        </span>

        {/* Divider */}
        <div
          className="my-4"
          style={{
            width: "80%",
            height: 1,
            backgroundColor: "rgba(10, 22, 40, 0.2)",
          }}
        />

        {/* Skills grid */}
        <div className="flex flex-wrap justify-center" style={{ width: "92%" }}>
          {cardData.skills.slice(0, 6).map((skill, i) => (
            <div
              key={i}
              className="flex flex-col items-center py-2"
              style={{ width: "33.33%" }}
            >
              {isEditing ? (
                <>
                  <input
                    type="number"
                    min={SKILL_SCORE_MIN}
                    max={SKILL_SCORE_MAX}
                    value={skill.score}
                    onChange={(e) => handleSkillScoreChange(i, e.target.value)}
                    className="w-14 rounded bg-transparent text-center outline-none"
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#0a1628",
                      lineHeight: 1,
                      border: "1px solid rgba(10,22,40,0.3)",
                    }}
                  />
                  <input
                    type="text"
                    value={skill.label}
                    onChange={(e) => handleSkillLabelChange(i, e.target.value)}
                    className="mt-1 w-20 rounded bg-transparent text-center uppercase outline-none"
                    style={{
                      fontSize: 9,
                      fontWeight: 400,
                      color: "rgba(10, 22, 40, 0.6)",
                      letterSpacing: 1.5,
                      border: "1px solid rgba(10,22,40,0.2)",
                    }}
                    maxLength={20}
                  />
                </>
              ) : (
                <>
                  <span
                    className="leading-none"
                    style={{
                      fontSize: 30,
                      fontWeight: 700,
                      color: "#0a1628",
                    }}
                  >
                    {skill.score}
                  </span>
                  <span
                    className="mt-1 text-center uppercase"
                    style={{
                      fontSize: 9,
                      fontWeight: 400,
                      color: "rgba(10, 22, 40, 0.6)",
                      letterSpacing: 1.5,
                    }}
                  >
                    {skill.label}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Watermark */}
        <span
          className="absolute"
          style={{
            bottom: 14,
            right: 18,
            fontSize: 9,
            color: "rgba(10, 22, 40, 0.3)",
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          LinkedIn FC
        </span>
      </div>
    </div>
  );
}

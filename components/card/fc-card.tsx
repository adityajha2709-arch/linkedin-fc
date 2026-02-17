"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import type { CardData } from "@/types/profile";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_GOLD_LIGHT,
  CARD_GOLD_MID,
  CARD_GOLD_PRIMARY,
  CARD_GOLD_DARK,
  CARD_GOLD_DARKER,
  CARD_BORDER_COLOR,
  CARD_TEXT_DARK,
  CARD_NAME_BAND,
  CARD_BORDER_WIDTH,
  SKILL_SCORE_MIN,
  SKILL_SCORE_MAX,
  MAX_PHOTO_SIZE_BYTES,
} from "@/config/constants";
import { deriveRoleAbbrev, getCompanyInitial, getInitials } from "@/lib/role-abbrev";

interface FcCardProps {
  cardData: CardData;
  onCardDataChange: (updated: CardData) => void;
}

export default function FcCard({ cardData, onCardDataChange }: FcCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const pos = deriveRoleAbbrev(cardData.currentRole);
  const companyInitial = getCompanyInitial(cardData.currentCompany);
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
          backgroundColor: isEditing ? CARD_GOLD_PRIMARY : "rgba(255,255,255,0.1)",
          color: isEditing ? CARD_TEXT_DARK : CARD_GOLD_PRIMARY,
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
          background: `linear-gradient(165deg, ${CARD_GOLD_LIGHT} 0%, ${CARD_GOLD_MID} 35%, ${CARD_GOLD_PRIMARY} 65%, ${CARD_GOLD_DARK} 100%)`,
          borderRadius: 16,
          border: `${CARD_BORDER_WIDTH}px solid ${CARD_BORDER_COLOR}`,
        }}
      >
        {/* Geometric texture overlays */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(30deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(150deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)",
          }}
        />

        {/* Inner border accent */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: 6,
            left: 6,
            right: 6,
            bottom: 6,
            borderRadius: 12,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        />

        {/* === Top section: Rating column (left) + Photo (center) === */}
        <div className="relative w-full" style={{ height: 280, padding: "24px 28px 0" }}>
          {/* Rating + Position + Badge column (top-left) */}
          <div
            className="absolute z-[2] flex flex-col items-center"
            style={{ left: 32, top: 28 }}
          >
            <span
              className="leading-none"
              style={{ fontSize: 64, fontWeight: 900, color: CARD_TEXT_DARK }}
            >
              {cardData.overallRating}
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: CARD_TEXT_DARK,
                letterSpacing: 2,
                marginTop: 2,
              }}
            >
              {pos}
            </span>
            {/* Company badge */}
            <div
              className="flex items-center justify-center"
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                background: `linear-gradient(180deg, ${CARD_GOLD_DARK}, ${CARD_GOLD_DARKER})`,
                border: `1px solid ${CARD_TEXT_DARK}`,
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: CARD_TEXT_DARK }}>
                {companyInitial}
              </span>
            </div>
          </div>

          {/* Photo (centered) */}
          <button
            type="button"
            onClick={() => isEditing && photoInputRef.current?.click()}
            className="group absolute overflow-hidden"
            style={{
              left: "50%",
              marginLeft: -90,
              top: 20,
              width: 180,
              height: 220,
              borderRadius: 8,
              backgroundColor: "rgba(44, 24, 16, 0.1)",
              cursor: isEditing ? "pointer" : "default",
              border: "none",
              padding: 0,
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
                style={{ borderRadius: 8 }}
              />
            ) : (
              <span
                className="flex h-full w-full items-center justify-center"
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: CARD_TEXT_DARK,
                  opacity: 0.5,
                }}
              >
                {initials}
              </span>
            )}

            {/* Bottom fade overlay */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0"
              style={{
                height: 70,
                background: `linear-gradient(to top, ${CARD_GOLD_MID}, rgba(212, 185, 110, 0))`,
              }}
            />

            {/* Edit overlay */}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30" style={{ borderRadius: 8 }}>
                <svg
                  width="28"
                  height="28"
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

        {/* === Name band === */}
        <div
          className="flex w-full flex-col items-center"
          style={{
            background: `linear-gradient(90deg, rgba(184, 152, 58, 0), ${CARD_NAME_BAND}, ${CARD_NAME_BAND}, rgba(184, 152, 58, 0))`,
            padding: "10px 0 8px",
            marginTop: 8,
          }}
        >
          <span
            className="text-center"
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: CARD_TEXT_DARK,
              letterSpacing: 3,
            }}
          >
            {cardData.name.toUpperCase()}
          </span>
        </div>

        {/* Role + Company */}
        <span
          className="mt-1 text-center"
          style={{
            fontSize: 10,
            fontWeight: 400,
            color: "rgba(44, 24, 16, 0.55)",
          }}
        >
          {cardData.currentRole} · {cardData.currentCompany}
        </span>

        {/* === Stats row === */}
        <div
          className="flex items-center justify-center"
          style={{
            width: "90%",
            padding: "14px 0",
            marginTop: 16,
            borderTop: "1px solid rgba(44, 24, 16, 0.15)",
            borderBottom: "1px solid rgba(44, 24, 16, 0.15)",
            background: "linear-gradient(90deg, rgba(168, 138, 53, 0), rgba(168, 138, 53, 0.25), rgba(168, 138, 53, 0.25), rgba(168, 138, 53, 0))",
          }}
        >
          {cardData.skills.slice(0, 6).map((skill, i) => (
            <div key={i} className="flex items-center">
              {/* Stat cell */}
              <div
                className="flex flex-col items-center"
                style={{ padding: "0 10px", minWidth: 52 }}
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={skill.label}
                      onChange={(e) => handleSkillLabelChange(i, e.target.value)}
                      className="w-14 bg-transparent text-center uppercase outline-none"
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        color: "rgba(44, 24, 16, 0.7)",
                        letterSpacing: 0.5,
                        border: "1px solid rgba(44, 24, 16, 0.2)",
                        borderRadius: 2,
                        padding: "1px 2px",
                      }}
                      maxLength={20}
                    />
                    <input
                      type="number"
                      min={SKILL_SCORE_MIN}
                      max={SKILL_SCORE_MAX}
                      value={skill.score}
                      onChange={(e) => handleSkillScoreChange(i, e.target.value)}
                      className="mt-1 w-12 bg-transparent text-center outline-none"
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: CARD_TEXT_DARK,
                        lineHeight: 1,
                        border: "1px solid rgba(44, 24, 16, 0.25)",
                        borderRadius: 2,
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span
                      className="text-center"
                      style={{
                        fontSize: skill.label.length > 10 ? 7 : 9,
                        fontWeight: 700,
                        color: "rgba(44, 24, 16, 0.7)",
                        letterSpacing: 0.5,
                      }}
                    >
                      {skill.label.toUpperCase()}
                    </span>
                    <span
                      className="leading-none"
                      style={{
                        fontSize: 24,
                        fontWeight: 900,
                        color: CARD_TEXT_DARK,
                        marginTop: 3,
                      }}
                    >
                      {skill.score}
                    </span>
                  </>
                )}
              </div>
              {/* Divider (not after last) */}
              {i < 5 && (
                <div
                  style={{
                    width: 1,
                    height: 32,
                    backgroundColor: "rgba(44, 24, 16, 0.2)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* === Watermark === */}
        <div className="mt-auto flex w-full justify-center pb-3">
          <span
            style={{
              fontSize: 8,
              color: "rgba(44, 24, 16, 0.25)",
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            LinkedIn FC
          </span>
        </div>
      </div>
    </div>
  );
}

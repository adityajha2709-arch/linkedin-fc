"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import type { CardData } from "@/types/profile";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_GOLD_MID,
  CARD_GOLD_CENTER,
  CARD_GOLD_LIGHT,
  CARD_GOLD_PRIMARY,
  CARD_GOLD_DARK,
  CARD_GOLD_DARKER,
  CARD_GOLD_EDGE,
  CARD_BORDER_COLOR,
  CARD_TEXT_DARK,
  CARD_NAME_BAND,
  CARD_NAME_TEXT,
  CARD_BORDER_WIDTH,
  SKILL_SCORE_MIN,
  SKILL_SCORE_MAX,
  MAX_PHOTO_SIZE_BYTES,
} from "@/config/constants";
import { getInitials } from "@/lib/role-abbrev";

interface FcCardProps {
  cardData: CardData;
  onCardDataChange: (updated: CardData) => void;
}

export default function FcCard({ cardData, onCardDataChange }: FcCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
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

  function renderStatCell(skill: { label: string; score: number }, index: number) {
    if (isEditing) {
      return (
        <div
          className="flex flex-col items-center"
          style={{ padding: "0 14px", minWidth: 80 }}
        >
          <input
            type="text"
            value={skill.label}
            onChange={(e) => handleSkillLabelChange(index, e.target.value)}
            className="w-16 bg-transparent text-center uppercase outline-none"
            style={{
              fontSize: 8,
              fontWeight: 700,
              color: "rgba(44, 24, 16, 0.7)",
              letterSpacing: 0.5,
              border: "1px solid rgba(44, 24, 16, 0.2)",
              borderRadius: 2,
              padding: "2px 3px",
            }}
            maxLength={20}
          />
          <input
            type="number"
            min={SKILL_SCORE_MIN}
            max={SKILL_SCORE_MAX}
            value={skill.score}
            onChange={(e) => handleSkillScoreChange(index, e.target.value)}
            className="mt-0.5 w-14 bg-transparent text-center outline-none"
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: CARD_TEXT_DARK,
              lineHeight: 1,
              border: "1px solid rgba(44, 24, 16, 0.25)",
              borderRadius: 2,
            }}
          />
        </div>
      );
    }
    return (
      <div
        className="flex flex-col items-center"
        style={{ padding: "0 14px", minWidth: 80 }}
      >
        <span
          className="text-center"
          style={{
            fontSize: skill.label.length > 12 ? 7 : 8,
            fontWeight: 700,
            color: "rgba(44, 24, 16, 0.55)",
            letterSpacing: 1,
          }}
        >
          {skill.label.toUpperCase()}
        </span>
        <span
          className="leading-none"
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: CARD_TEXT_DARK,
            marginTop: 1,
          }}
        >
          {skill.score}
        </span>
      </div>
    );
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
          background: `radial-gradient(ellipse at 50% 35%, ${CARD_GOLD_CENTER} 0%, ${CARD_GOLD_LIGHT} 25%, ${CARD_GOLD_MID} 45%, ${CARD_GOLD_PRIMARY} 65%, ${CARD_GOLD_DARK} 85%, ${CARD_GOLD_EDGE} 100%)`,
          borderRadius: 14,
          border: `${CARD_BORDER_WIDTH}px solid ${CARD_BORDER_COLOR}`,
        }}
      >
        {/* Sunburst ray overlays — radiating light streaks like EA FC */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(0deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(30deg, transparent 35%, rgba(255,255,255,0.06) 48%, transparent 55%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(60deg, transparent 35%, rgba(255,255,255,0.05) 48%, transparent 55%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.05) 48%, transparent 55%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(150deg, transparent 35%, rgba(255,255,255,0.06) 48%, transparent 55%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)",
          }}
        />

        {/* Inner border accent */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: 5,
            left: 5,
            right: 5,
            bottom: 5,
            borderRadius: 10,
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        />

        {/* === Top section: Rating (left) + Photo (center) === */}
        <div className="relative w-full" style={{ height: 280 }}>
          {/* Rating — top-left */}
          <div
            className="absolute z-[2] flex flex-col items-center"
            style={{ left: 24, top: 18 }}
          >
            <span
              className="leading-none"
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: CARD_TEXT_DARK,
                letterSpacing: -1,
              }}
            >
              {cardData.overallRating}
            </span>
          </div>

          {/* Photo frame with shadow glow */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: "50%",
              marginLeft: -99,
              top: 16,
              width: 198,
              height: 238,
              borderRadius: 10,
              background: "rgba(44, 24, 16, 0.15)",
            }}
          >
            {/* Photo container as upload button */}
            <button
              type="button"
              onClick={() => isEditing && photoInputRef.current?.click()}
              className="group relative flex items-center justify-center overflow-hidden"
              style={{
                width: 190,
                height: 230,
                borderRadius: 8,
                border: `3px solid ${CARD_GOLD_DARKER}`,
                backgroundColor: "rgba(44, 24, 16, 0.08)",
                cursor: isEditing ? "pointer" : "default",
                padding: 0,
              }}
              disabled={!isEditing}
            >
              {cardData.photo ? (
                <Image
                  src={cardData.photo}
                  alt="Player photo"
                  fill
                  className="object-cover object-top"
                  style={{ borderRadius: 6 }}
                  unoptimized
                />
              ) : (
                <span
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    fontSize: 56,
                    fontWeight: 700,
                    color: CARD_TEXT_DARK,
                    opacity: 0.35,
                  }}
                >
                  {initials}
                </span>
              )}

              {/* Subtle bottom fade inside frame */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0"
                style={{
                  height: 50,
                  background: "linear-gradient(to top, rgba(139, 114, 50, 0.5), rgba(139, 114, 50, 0))",
                }}
              />

              {/* Edit overlay */}
              {isEditing && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30" style={{ borderRadius: 6 }}>
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
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Thin separator line above name */}
        <div
          style={{
            width: "70%",
            height: 1,
            backgroundColor: "rgba(44, 24, 16, 0.2)",
          }}
        />

        {/* === Name band === */}
        <div
          className="flex w-full flex-col items-center"
          style={{
            background: `linear-gradient(90deg, rgba(184,148,64,0), ${CARD_NAME_BAND}, ${CARD_NAME_BAND}, rgba(184,148,64,0))`,
            padding: "8px 0 6px",
          }}
        >
          <span
            className="text-center"
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: CARD_NAME_TEXT,
              letterSpacing: 3,
            }}
          >
            {cardData.name.toUpperCase()}
          </span>
        </div>

        {/* Role + Company */}
        <span
          className="text-center"
          style={{
            fontSize: 10,
            fontWeight: 400,
            color: "rgba(44, 24, 16, 0.5)",
            marginTop: 2,
          }}
        >
          {cardData.currentRole} · {cardData.currentCompany}
        </span>

        {/* === Stats grid (2 rows of 3) === */}
        <div
          className="flex flex-col"
          style={{
            width: "90%",
            marginTop: 6,
            borderTop: "1px solid rgba(44, 24, 16, 0.15)",
          }}
        >
          {/* Row 1: skills[0..2] */}
          <div
            className="flex items-center justify-center"
            style={{ padding: "8px 0 6px" }}
          >
            {cardData.skills.slice(0, 3).map((skill, i) => (
              <div key={i} className="flex items-center">
                {renderStatCell(skill, i)}
                {i < 2 && (
                  <div
                    style={{
                      width: 1,
                      height: 32,
                      backgroundColor: "rgba(44, 24, 16, 0.12)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Horizontal divider between rows */}
          <div
            className="self-center"
            style={{
              width: "75%",
              height: 1,
              backgroundColor: "rgba(44, 24, 16, 0.1)",
            }}
          />

          {/* Row 2: skills[3..5] */}
          <div
            className="flex items-center justify-center"
            style={{ padding: "6px 0 8px" }}
          >
            {cardData.skills.slice(3, 6).map((skill, i) => (
              <div key={i + 3} className="flex items-center">
                {renderStatCell(skill, i + 3)}
                {i < 2 && (
                  <div
                    style={{
                      width: 1,
                      height: 32,
                      backgroundColor: "rgba(44, 24, 16, 0.12)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* === Watermark === */}
        <div className="mt-1.5 flex w-full justify-center pb-2">
          <span
            style={{
              fontSize: 6,
              color: "rgba(44, 24, 16, 0.15)",
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

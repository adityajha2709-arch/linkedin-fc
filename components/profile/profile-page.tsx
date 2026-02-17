"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile-context";
import ProfileHeader from "./profile-header";
import ProfileSummary from "./profile-summary";
import CareerTimeline from "./career-timeline";
import EducationTimeline from "./education-timeline";
import SkillsRadar from "./skills-radar";
import CardModal from "@/components/card/card-modal";

export default function ProfilePage() {
  const router = useRouter();
  const { profileData, photoOverride, setPhotoOverride, clearProfile } =
    useProfile();
  const [showCard, setShowCard] = useState(false);

  if (!profileData) return null;

  const displayPhoto = photoOverride ?? profileData.photo ?? null;

  function handleStartOver() {
    clearProfile();
    router.push("/");
  }

  return (
    <div
      className="pitch-texture stadium-light relative min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #0a1628 0%, #0d2018 40%, #0a1628 70%, #0d2818 100%)",
      }}
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Back link */}
        <button
          onClick={handleStartOver}
          className="mb-6 flex items-center gap-1.5 text-xs font-medium text-text-tertiary transition-colors hover:text-gold-primary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Upload new PDF
        </button>

        <div className="flex flex-col gap-8">
          {/* Header — full width */}
          <ProfileHeader
            name={profileData.name}
            currentRole={profileData.currentRole}
            currentCompany={profileData.currentCompany}
            location={profileData.location}
            overallRating={profileData.overallRating}
            photo={displayPhoto}
            onPhotoUpload={setPhotoOverride}
            careerHistory={profileData.careerHistory}
            skillsCount={profileData.skills.length}
          />

          {/* Generate Card CTA — placed right after header for visibility */}
          <div className="flex flex-col items-center gap-6">
            {/* Generic card preview (decorative) */}
            <div
              className="relative cursor-pointer opacity-80 transition-all hover:scale-[1.02] hover:opacity-100"
              onClick={() => setShowCard(true)}
              style={{
                width: 200,
                height: 280,
                borderRadius: 12,
                border: "3px solid #5C4A1E",
                background: "linear-gradient(165deg, #E8D48B 0%, #D4B96E 35%, #C4A962 65%, #A8893E 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(196,169,98,0.2)",
                overflow: "hidden",
                padding: "16px 12px",
              }}
            >
              {/* Mini rating */}
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#2C1810",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                {profileData.overallRating}
              </span>
              {/* Silhouette placeholder */}
              <div
                className="mx-auto"
                style={{
                  width: 80,
                  height: 90,
                  marginTop: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(44, 24, 16, 0.1)",
                }}
              />
              {/* Name placeholder bar */}
              <div
                className="mx-auto"
                style={{
                  width: "80%",
                  height: 8,
                  marginTop: 12,
                  borderRadius: 4,
                  backgroundColor: "rgba(44, 24, 16, 0.15)",
                }}
              />
              {/* Stats placeholder bars */}
              <div className="mx-auto mt-3 flex justify-center gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 20,
                      borderRadius: 2,
                      backgroundColor: "rgba(44, 24, 16, 0.1)",
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowCard(true)}
              className="rounded-2xl px-10 py-4 text-base font-bold uppercase tracking-wide transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #E8D48B 0%, #C4A962 50%, #E8D48B 100%)",
                color: "#2C1810",
                boxShadow: "0 0 20px rgba(196,169,98,0.3), 0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              Generate Your FC Card
            </button>
          </div>

          {/* Two-column: Scouting Report + Radar Chart */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ProfileSummary summary={profileData.summary} />
            </div>
            <div className="lg:col-span-2">
              <SkillsRadar skills={profileData.skills} />
            </div>
          </div>

          {/* Club Career — full width */}
          <CareerTimeline entries={profileData.careerHistory} />

          {/* Youth Development — full width */}
          <EducationTimeline entries={profileData.education} />
        </div>
      </div>

      <CardModal isOpen={showCard} onClose={() => setShowCard(false)} />
    </div>
  );
}

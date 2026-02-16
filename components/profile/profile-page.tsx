"use client";

import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile-context";
import ProfileHeader from "./profile-header";
import ProfileSummary from "./profile-summary";
import CareerTimeline from "./career-timeline";
import EducationTimeline from "./education-timeline";
import SkillsRadar from "./skills-radar";

export default function ProfilePage() {
  const router = useRouter();
  const { profileData, photoOverride, setPhotoOverride, clearProfile } =
    useProfile();

  if (!profileData) return null;

  const displayPhoto = photoOverride ?? profileData.photo ?? null;

  function handleStartOver() {
    clearProfile();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Back link */}
        <button
          onClick={handleStartOver}
          className="mb-6 flex items-center gap-1.5 text-xs font-medium text-text-tertiary transition-colors hover:text-text-secondary"
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

          {/* Generate Card CTA */}
          <div className="flex justify-center pb-8">
            <button
              disabled
              className="rounded-2xl bg-accent/20 px-10 py-4 text-base font-bold text-accent/50 transition-colors"
            >
              Generate Card — Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

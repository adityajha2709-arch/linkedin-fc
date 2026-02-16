import PhotoUpload from "./photo-upload";
import { RATING_TIERS } from "@/config/constants";
import type { CareerEntry } from "@/types/profile";

interface ProfileHeaderProps {
  name: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  overallRating: number;
  photo: string | null;
  onPhotoUpload: (dataUrl: string) => void;
  careerHistory: CareerEntry[];
  skillsCount: number;
}

function getRatingTier(rating: number) {
  for (const tier of RATING_TIERS) {
    if (rating >= tier.min && rating <= tier.max) return tier;
  }
  return RATING_TIERS[RATING_TIERS.length - 1];
}

function getCareerYears(careerHistory: CareerEntry[]): number {
  if (careerHistory.length === 0) return 0;
  const earliest = careerHistory[careerHistory.length - 1];
  const yearMatch = earliest.startDate.match(/\d{4}/);
  if (!yearMatch) return 0;
  return new Date().getFullYear() - parseInt(yearMatch[0], 10);
}

export default function ProfileHeader({
  name,
  currentRole,
  currentCompany,
  location,
  overallRating,
  photo,
  onPhotoUpload,
  careerHistory,
  skillsCount,
}: ProfileHeaderProps) {
  const tier = getRatingTier(overallRating);
  const careerYears = getCareerYears(careerHistory);
  const companiesCount = new Set(careerHistory.map((e) => e.company)).size;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(165deg, #0f1f2e 0%, #0a1929 60%, ${tier.color}08 100%)`,
        border: `1px solid rgba(212,168,67,0.12)`,
        boxShadow: `0 0 0 1px ${tier.color}15, 0 0 40px ${tier.color}10, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${tier.color}, ${tier.color}80, transparent)`,
        }}
      />

      {/* Inner border glow */}
      <div
        className="pointer-events-none absolute inset-[1px] rounded-2xl"
        style={{
          border: `1px solid ${tier.color}10`,
        }}
      />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-8">
          {/* Photo */}
          <PhotoUpload
            photo={photo}
            onPhotoUpload={onPhotoUpload}
            glowColor={tier.color}
          />

          {/* Info */}
          <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <h1
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textShadow: `0 0 40px ${tier.color}20` }}
            >
              {name}
            </h1>
            <p className="text-base text-text-secondary">
              {currentRole}
              {currentCompany && (
                <span className="text-text-tertiary"> · {currentCompany}</span>
              )}
            </p>
            {location && (
              <p className="flex items-center gap-1.5 text-sm text-text-tertiary">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {location}
              </p>
            )}
          </div>

          {/* Rating badge — hexagonal shield */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex h-24 w-20 items-center justify-center text-5xl font-black sm:h-28 sm:w-24 sm:text-6xl"
              style={{
                background: `linear-gradient(180deg, ${tier.color} 0%, ${tier.color}dd 40%, ${tier.color}99 100%)`,
                color: "#0a1628",
                clipPath:
                  "polygon(50% 0%, 100% 10%, 100% 70%, 50% 100%, 0% 70%, 0% 10%)",
                animation: "rating-glow 3s ease-in-out infinite",
              }}
            >
              {overallRating}
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: tier.color }}
            >
              {tier.label}
            </span>
          </div>
        </div>

        {/* Stats strip — broadcast overlay style */}
        <div
          className="mt-6 grid grid-cols-3 gap-0 overflow-hidden rounded-xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,168,67,0.06), rgba(212,168,67,0.03), rgba(212,168,67,0.06))",
            border: "1px solid rgba(212,168,67,0.10)",
          }}
        >
          <div className="border-r border-white/[0.06] py-4 text-center">
            <p
              className="text-2xl font-black tabular-nums"
              style={{ color: tier.color }}
            >
              {careerYears}+
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
              Years
            </p>
          </div>
          <div className="border-r border-white/[0.06] py-4 text-center">
            <p
              className="text-2xl font-black tabular-nums"
              style={{ color: tier.color }}
            >
              {companiesCount}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
              Clubs
            </p>
          </div>
          <div className="py-4 text-center">
            <p
              className="text-2xl font-black tabular-nums"
              style={{ color: tier.color }}
            >
              {skillsCount}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
              Skills
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

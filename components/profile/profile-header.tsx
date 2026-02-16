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
        background: `linear-gradient(135deg, ${tier.color}15 0%, #16161a 50%, ${tier.color}08 100%)`,
      }}
    >
      {/* Top accent line */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${tier.color}, ${tier.color}40, transparent)`,
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
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
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

          {/* Rating badge */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl font-black sm:h-24 sm:w-24 sm:text-5xl"
              style={{
                backgroundColor: `${tier.color}20`,
                color: tier.color,
                boxShadow: `0 0 30px ${tier.color}25`,
              }}
            >
              {overallRating}
            </div>
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: tier.color }}
            >
              {tier.label}
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{careerYears}+</p>
            <p className="mt-0.5 text-xs uppercase tracking-wider text-text-tertiary">
              Years
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{companiesCount}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wider text-text-tertiary">
              Clubs
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{skillsCount}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wider text-text-tertiary">
              Skills
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

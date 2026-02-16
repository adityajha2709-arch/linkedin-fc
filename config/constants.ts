export const RATING_MIN = 65;
export const RATING_MAX = 98;

export const MAX_SKILLS = 6;
export const SKILL_SCORE_MIN = 0;
export const SKILL_SCORE_MAX = 99;

export const CARD_WIDTH = 450;
export const CARD_HEIGHT = 630;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ["application/pdf"] as const;

export const CLAUDE_MODEL = "claude-sonnet-4-5-20250929";
export const CLAUDE_MAX_TOKENS = 4096;

export const LINKEDIN_CONFIDENCE_THRESHOLD = 0.5;

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const RATING_TIERS = [
  { min: 90, max: 98, label: "World Class", color: "#FFD700" },
  { min: 85, max: 89, label: "Elite", color: "#D4A843" },
  { min: 75, max: 84, label: "Professional", color: "#B8922E" },
  { min: 65, max: 74, label: "Rising Star", color: "#C9A84C" },
] as const;

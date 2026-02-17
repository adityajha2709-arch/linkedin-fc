export const RATING_MIN = 65;
export const RATING_MAX = 98;

export const MAX_SKILLS = 6;
export const SKILL_SCORE_MIN = 0;
export const SKILL_SCORE_MAX = 99;

export const CARD_WIDTH = 400;
export const CARD_HEIGHT = 530;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ["application/pdf"] as const;

export const CLAUDE_MODEL = "claude-sonnet-4-5-20250929";
export const CLAUDE_MAX_TOKENS = 4096;

export const LINKEDIN_CONFIDENCE_THRESHOLD = 0.5;
export const SPARSE_PROFILE_MIN_ROLES = 2;
export const SPARSE_PROFILE_MIN_MEANINGFUL_SKILLS = 3;

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

// FUT Card Colors
export const CARD_GOLD_LIGHT = "#E8D48B";
export const CARD_GOLD_MID = "#D4B96E";
export const CARD_GOLD_PRIMARY = "#C4A962";
export const CARD_GOLD_DARK = "#A8893E";
export const CARD_GOLD_DARKER = "#8B7232";
export const CARD_GOLD_CENTER = "#F0E0A0";
export const CARD_GOLD_EDGE = "#8A6F2A";
export const CARD_BORDER_COLOR = "#3D2E10";
export const CARD_TEXT_DARK = "#2C1810";
export const CARD_NAME_BAND = "#B89440";
export const CARD_NAME_TEXT = "#2C1810";
export const CARD_STATS_BAND = "#A88A35";
export const CARD_WATERMARK = "LinkedIn FC";
export const CARD_BORDER_WIDTH = 2;

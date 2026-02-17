export interface CareerEntry {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  startYear?: string;
  endYear?: string;
  description?: string;
}

export interface SkillEntry {
  label: string;
  score: number;
}

export interface ProfileData {
  name: string;
  photo?: string | null;
  currentRole: string;
  currentCompany: string;
  location: string;
  overallRating: number;
  summary: string;
  careerHistory: CareerEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  linkedinConfidence: number;
}

export interface ParseError {
  error: string;
  code:
    | "INVALID_FILE_TYPE"
    | "FILE_TOO_LARGE"
    | "NO_FILE_PROVIDED"
    | "PARSE_FAILED"
    | "INVALID_RESPONSE"
    | "API_ERROR";
}

export interface ParsePdfResponse {
  success: true;
  data: ProfileData;
}

export interface ParsePdfErrorResponse {
  success: false;
  error: ParseError;
}

export interface CardData {
  name: string;
  photo: string | null;
  currentRole: string;
  currentCompany: string;
  overallRating: number;
  skills: SkillEntry[];
}

export interface GenerateCardRequest {
  cardData: CardData;
}

export interface GenerateCardErrorResponse {
  success: false;
  error: string;
}

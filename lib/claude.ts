import Anthropic from "@anthropic-ai/sdk";
import type { ProfileData } from "@/types/profile";
import {
  CLAUDE_MODEL,
  CLAUDE_MAX_TOKENS,
  RATING_MIN,
  RATING_MAX,
  MAX_SKILLS,
  SKILL_SCORE_MIN,
  SKILL_SCORE_MAX,
} from "@/config/constants";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a data extraction engine. You receive a PDF file that is likely (but not certainly) a LinkedIn profile export. Your job is to extract structured career data and return it as a JSON object.

IMPORTANT RULES:
1. Return ONLY valid JSON. No markdown fences, no explanation, no preamble, no trailing text. The response must be parseable by JSON.parse() directly.
2. The JSON must conform exactly to this schema:

{
  "name": "string — Full name as shown on the PDF",
  "photo": null,
  "currentRole": "string — Most recent job title. If unemployed, use the last known title.",
  "currentCompany": "string — Most recent employer. If unemployed, use the last known company.",
  "location": "string — Geographic location if mentioned, otherwise 'Unknown'",
  "overallRating": "number — An integer between ${RATING_MIN} and ${RATING_MAX} representing overall career strength. Consider: years of experience, seniority progression, company prestige, breadth of skills, education quality. ${RATING_MIN} is entry-level with minimal experience. ${RATING_MAX} is reserved for truly exceptional careers (C-suite at major companies, world-class expertise). Most professionals fall between 72-88.",
  "summary": "string — A third-person biographical summary written in the style of a footballer's bio card. 2-4 sentences. Energetic, professional tone. Example: 'A seasoned engineering leader with over a decade of experience building high-scale distributed systems. Known for transforming underperforming teams into elite units. Currently commanding the technical strategy at Stripe.' If the PDF includes a summary/about section, rewrite it in this style. If not, generate one from the career history.",
  "careerHistory": [
    {
      "title": "string — Job title",
      "company": "string — Company name",
      "location": "string or null — Role location if different from main location. Use null if not available.",
      "startDate": "string — e.g. 'Jan 2020'",
      "endDate": "string — e.g. 'Present' or 'Dec 2023'",
      "description": "string — Role description or responsibilities. Empty string if none."
    }
  ],
  "education": [
    {
      "institution": "string — School/university name",
      "degree": "string — Degree and field, e.g. 'BS Computer Science'",
      "startYear": "string or null — Use null if not available",
      "endYear": "string or null — Use null if not available",
      "description": "string or null — Honors, activities, etc. Use null if not available"
    }
  ],
  "skills": [
    {
      "label": "string — 1-2 word skill label, e.g. 'Leadership', 'Python', 'System Design'",
      "score": "number — Integer ${SKILL_SCORE_MIN}-${SKILL_SCORE_MAX} representing depth of experience in this skill based on career evidence"
    }
  ],
  "linkedinConfidence": "number — Float between 0.0 and 1.0 indicating your confidence that this PDF is a genuine LinkedIn profile export. 1.0 = clearly LinkedIn (has standard LinkedIn PDF structure with name, headline, experience, education sections). 0.0 = clearly not LinkedIn. If the PDF lacks a name or experience section, this should be below 0.3."
}

3. The "skills" array must contain exactly ${MAX_SKILLS} entries. Derive skill labels from the LinkedIn skills section if present. If the skills section is missing or has fewer than ${MAX_SKILLS} skills, infer additional skills from job titles, role descriptions, and industry context.

4. Skill scores must be integers between ${SKILL_SCORE_MIN} and ${SKILL_SCORE_MAX}. Base them on evidence:
   - Years of apparent use of the skill
   - Whether the skill appeared in senior vs junior roles
   - How prominently the skill features in descriptions
   - Do NOT give all skills the same score. Create meaningful differentiation.

5. The "overallRating" must be an integer between ${RATING_MIN} and ${RATING_MAX}. Never go outside this range.

6. Career history must be ordered most recent first.

7. Set "photo" to null always. Photo extraction from PDFs is unreliable.

8. If the PDF is clearly not a LinkedIn export (e.g., it is a resume in a different format, a random document, etc.), still attempt to extract whatever career data you can, but set linkedinConfidence accordingly low.`;

export async function parsePdfWithClaude(
  pdfBuffer: ArrayBuffer
): Promise<ProfileData> {
  const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: CLAUDE_MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64Pdf,
            },
          },
          {
            type: "text",
            text: "Extract the career profile data from this PDF and return it as JSON following the schema in your instructions.",
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content in the response.");
  }

  const rawJson = textBlock.text.trim();

  console.log("[parse-pdf] Claude raw response length:", rawJson.length);
  console.log("[parse-pdf] Claude raw response start:", rawJson.substring(0, 500));

  // Sanitize: replace JavaScript `undefined` with JSON `null`
  const sanitizeJson = (str: string) =>
    str.replace(/:\s*undefined\b/g, ": null");

  let jsonStr = rawJson;

  // Strip markdown fences if present
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  jsonStr = sanitizeJson(jsonStr);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (jsonError) {
    console.error("[parse-pdf] JSON.parse failed after sanitization:", jsonError);
    console.error("[parse-pdf] Sanitized JSON start:", jsonStr.substring(0, 500));
    throw new Error(
      "Claude response was not valid JSON. Raw start: " +
        rawJson.substring(0, 500)
    );
  }

  try {
    return validateAndClamp(parsed);
  } catch (validationError) {
    console.error("[parse-pdf] Validation failed:", validationError);
    console.error("[parse-pdf] Parsed data keys:", Object.keys(parsed as Record<string, unknown>));
    console.error("[parse-pdf] Parsed data preview:", JSON.stringify(parsed, null, 2).substring(0, 1000));
    throw validationError;
  }
}

function validateAndClamp(data: unknown): ProfileData {
  if (typeof data !== "object" || data === null) {
    throw new Error("Parsed response is not an object.");
  }

  const d = data as Record<string, unknown>;

  const requiredStrings = [
    "name",
    "currentRole",
    "currentCompany",
    "location",
    "summary",
  ] as const;
  for (const field of requiredStrings) {
    if (typeof d[field] !== "string" || (d[field] as string).trim() === "") {
      throw new Error(`Missing or empty required field: "${field}"`);
    }
  }

  if (typeof d.overallRating !== "number") {
    throw new Error("overallRating must be a number.");
  }
  const overallRating = Math.round(
    Math.min(RATING_MAX, Math.max(RATING_MIN, d.overallRating))
  );

  if (!Array.isArray(d.careerHistory)) {
    throw new Error("careerHistory must be an array.");
  }

  if (!Array.isArray(d.education)) {
    throw new Error("education must be an array.");
  }

  if (!Array.isArray(d.skills)) {
    throw new Error("skills must be an array.");
  }

  const skills = (d.skills as Array<Record<string, unknown>>)
    .slice(0, MAX_SKILLS)
    .map((s) => ({
      label: typeof s.label === "string" ? s.label : "Unknown",
      score: Math.round(
        Math.min(
          SKILL_SCORE_MAX,
          Math.max(SKILL_SCORE_MIN, typeof s.score === "number" ? s.score : 50)
        )
      ),
    }));

  while (skills.length < MAX_SKILLS) {
    skills.push({ label: "General", score: 50 });
  }

  const rawConfidence =
    typeof d.linkedinConfidence === "number" ? d.linkedinConfidence : 0.5;
  const linkedinConfidence = Math.min(1.0, Math.max(0.0, rawConfidence));

  return {
    name: (d.name as string).trim(),
    photo: null,
    currentRole: (d.currentRole as string).trim(),
    currentCompany: (d.currentCompany as string).trim(),
    location: (d.location as string).trim(),
    overallRating,
    summary: (d.summary as string).trim(),
    careerHistory: (d.careerHistory as Array<Record<string, unknown>>).map(
      (entry) => ({
        title: typeof entry.title === "string" ? entry.title : "Unknown",
        company: typeof entry.company === "string" ? entry.company : "Unknown",
        location:
          typeof entry.location === "string" ? entry.location : undefined,
        startDate:
          typeof entry.startDate === "string" ? entry.startDate : "Unknown",
        endDate:
          typeof entry.endDate === "string" ? entry.endDate : "Unknown",
        description:
          typeof entry.description === "string" ? entry.description : "",
      })
    ),
    education: (d.education as Array<Record<string, unknown>>).map(
      (entry) => ({
        institution:
          typeof entry.institution === "string"
            ? entry.institution
            : "Unknown",
        degree: typeof entry.degree === "string" ? entry.degree : "Unknown",
        startYear:
          typeof entry.startYear === "string" ? entry.startYear : undefined,
        endYear:
          typeof entry.endYear === "string" ? entry.endYear : undefined,
        description:
          typeof entry.description === "string" ? entry.description : undefined,
      })
    ),
    skills,
    linkedinConfidence,
  };
}

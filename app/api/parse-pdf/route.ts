import { NextRequest, NextResponse } from "next/server";
import { validatePdf } from "@/lib/pdf-validator";
import { parsePdfWithClaude } from "@/lib/claude";
import {
  LINKEDIN_CONFIDENCE_THRESHOLD,
  SPARSE_PROFILE_MIN_ROLES,
  SPARSE_PROFILE_MIN_MEANINGFUL_SKILLS,
} from "@/config/constants";
import type {
  ParsePdfResponse,
  ParsePdfErrorResponse,
  ParseWarning,
} from "@/types/profile";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ParsePdfResponse | ParsePdfErrorResponse>> {
  try {
    const formData = await request.formData();
    const validation = await validatePdf(formData);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false as const,
          error: { error: validation.message, code: validation.code },
        },
        { status: 400 }
      );
    }

    const profileData = await parsePdfWithClaude(validation.buffer);

    const warnings: ParseWarning[] = [];

    if (profileData.linkedinConfidence < LINKEDIN_CONFIDENCE_THRESHOLD) {
      warnings.push({
        code: "LOW_CONFIDENCE",
        message:
          "This doesn\u2019t look like a LinkedIn PDF. Make sure you\u2019re using Profile \u2192 \u22EF \u2192 Save to PDF.",
      });
    }

    const meaningfulSkills = profileData.skills.filter(
      (s) => !(s.label === "General" && s.score === 50)
    );
    const missingSections: string[] = [];
    if (profileData.careerHistory.length < SPARSE_PROFILE_MIN_ROLES) {
      missingSections.push("work experience");
    }
    if (meaningfulSkills.length < SPARSE_PROFILE_MIN_MEANINGFUL_SKILLS) {
      missingSections.push("skills");
    }
    if (profileData.education.length === 0) {
      missingSections.push("education");
    }
    if (missingSections.length > 0) {
      warnings.push({
        code: "SPARSE_PROFILE",
        message: `Your LinkedIn profile is light on details. Add more ${missingSections.join(" and ")} to get a better card.`,
      });
    }

    return NextResponse.json({
      success: true as const,
      data: profileData,
      ...(warnings.length > 0 && { warnings }),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("not valid JSON") ||
        error.message.includes("not an object"))
    ) {
      console.error("Corrupted PDF or unreadable content:", error);
      return NextResponse.json(
        {
          success: false as const,
          error: {
            error:
              "We couldn\u2019t read this file. Try re-downloading your LinkedIn PDF.",
            code: "PARSE_FAILED" as const,
          },
        },
        { status: 422 }
      );
    }

    const isAnthropicError =
      error instanceof Error &&
      error.constructor.name.includes("Anthropic");

    if (isAnthropicError) {
      console.error("Anthropic API error:", error);
      return NextResponse.json(
        {
          success: false as const,
          error: {
            error:
              "The AI service encountered an error processing your PDF. Please try again.",
            code: "API_ERROR" as const,
          },
        },
        { status: 502 }
      );
    }

    if (
      error instanceof Error &&
      error.message.includes("Claude response")
    ) {
      console.error("Claude response parsing error:", error);
      return NextResponse.json(
        {
          success: false as const,
          error: {
            error:
              "Could not extract profile data from this PDF. Please ensure it is a LinkedIn profile export.",
            code: "PARSE_FAILED" as const,
          },
        },
        { status: 422 }
      );
    }

    if (error instanceof Error) {
      console.error("Validation error:", error.message);
      return NextResponse.json(
        {
          success: false as const,
          error: {
            error: `The extracted data was incomplete or malformed: ${error.message}`,
            code: "INVALID_RESPONSE" as const,
          },
        },
        { status: 422 }
      );
    }

    console.error("Unknown error in parse-pdf:", error);
    return NextResponse.json(
      {
        success: false as const,
        error: {
          error: "An unexpected error occurred. Please try again.",
          code: "PARSE_FAILED" as const,
        },
      },
      { status: 500 }
    );
  }
}

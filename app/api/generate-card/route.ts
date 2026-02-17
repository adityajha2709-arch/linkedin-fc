import { NextRequest, NextResponse } from "next/server";
import { renderCardToSvg, convertSvgToPng } from "@/lib/card-renderer";
import type { GenerateCardRequest, GenerateCardErrorResponse } from "@/types/profile";
import {
  RATING_MIN,
  RATING_MAX,
  MAX_SKILLS,
  SKILL_SCORE_MIN,
  SKILL_SCORE_MAX,
} from "@/config/constants";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const body = (await request.json()) as GenerateCardRequest;
    const { cardData } = body;

    if (
      !cardData ||
      !cardData.name ||
      typeof cardData.overallRating !== "number" ||
      !Array.isArray(cardData.skills)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid card data provided." } satisfies GenerateCardErrorResponse,
        { status: 400 }
      );
    }

    // Clamp rating
    cardData.overallRating = Math.round(
      Math.min(RATING_MAX, Math.max(RATING_MIN, cardData.overallRating))
    );

    // Clamp skill scores and limit to MAX_SKILLS
    cardData.skills = cardData.skills.slice(0, MAX_SKILLS).map((s) => ({
      label: s.label || "Skill",
      score: Math.round(
        Math.min(SKILL_SCORE_MAX, Math.max(SKILL_SCORE_MIN, s.score))
      ),
    }));

    const svg = await renderCardToSvg(cardData);
    const png = convertSvgToPng(svg);

    const safeName = cardData.name.replace(/[^a-zA-Z0-9]/g, "_");

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${safeName}_linkedin_fc.png"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Card generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate card. Please try again." } satisfies GenerateCardErrorResponse,
      { status: 500 }
    );
  }
}

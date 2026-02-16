import { NextRequest, NextResponse } from "next/server";
import { validatePdf } from "@/lib/pdf-validator";
import { parsePdfWithClaude } from "@/lib/claude";
import type {
  ParsePdfResponse,
  ParsePdfErrorResponse,
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

    return NextResponse.json({ success: true as const, data: profileData });
  } catch (error) {
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

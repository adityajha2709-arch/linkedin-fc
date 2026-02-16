# LinkedIn FIFA Card

Web app that converts a LinkedIn profile PDF into a FIFA-style career card. Users upload their own exported PDF, AI parses it, and they get a downloadable PNG card.

## Tech Stack
- Next.js 14+ with App Router (TypeScript, strict mode)
- Claude API for PDF parsing (send PDF, get structured JSON)
- Satori + @resvg/resvg-js for card-to-PNG (server-side)
- Vercel for hosting
- No database. Entirely stateless per session.

## Architecture
```
app/                → Pages and API routes
  api/parse-pdf/    → Claude API integration (accepts PDF, returns ProfileData JSON)
  api/generate-card/ → Satori PNG generation endpoint
components/         → UI components
  landing/          → Upload CTA, instruction GIF
  profile/          → Full profile page (header, career, education)
  card/             → FC card component (editable skills, scores)
lib/
  claude.ts         → Claude API client, prompt, and JSON schema
  card-renderer.ts  → Satori template for FC card
  pdf-validator.ts  → MIME check, LinkedIn PDF detection
types/
  profile.ts        → ProfileData interface (single source of truth for all parsed data)
config/
  constants.ts      → Card dimensions, rating bounds (65-98), max skills (6)
public/             → Static assets, fonts, instruction GIF
```

## Key Interfaces
ProfileData is the core type. Every component consumes it. Define it first in `types/profile.ts` before building anything else. It must include: name, photo (optional), currentRole, currentCompany, location, overallRating, summary, careerHistory (array), education (array), skills (array of {label, score}).

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript strict check

## Critical Rules
- Photo extraction from LinkedIn PDFs is unreliable. Always show a photo upload fallback. Never block the flow on photo extraction.
- Overall rating must be between 65-98. No one gets below 65 (feels insulting) or above 98 (feels fake).
- Skill labels: 1-2 words, no hard character truncation. Use responsive font sizing in the card layout instead.
- FC card must include a small watermark/branding in the bottom corner.
- All 5 error states must have specific user-facing messages (see PRD error matrix). Never show a blank screen or generic error.
- Card PNG output dimensions must work as a LinkedIn profile picture.

## AI Parsing Prompt Design
The Claude API call for PDF parsing should:
1. Return valid JSON matching the ProfileData interface. No markdown, no preamble.
2. Generate a third-person bio (like a footballer bio) if no LinkedIn summary exists.
3. Generate 6 skill labels from the skills section. If skills section is missing, infer from roles and job titles.
4. Rate skills 0-99 based on apparent experience depth, not arbitrary numbers.
5. Detect if the PDF is NOT a LinkedIn export (missing name/experience structure) and return a confidence flag.

## Milestones (build in this order)
1. PDF parsing + ProfileData JSON output
2. Full profile page render
3. FC card + PNG download + edit mode + watermark
4. Landing page + error handling

## Don't Do
- No LinkedIn OAuth, no scraping, no browser automation
- No database or user accounts
- No spider chart (removed from V1)
- No share flow (removed from V1)
- Don't use html2canvas (use Satori instead, server-side is more reliable)

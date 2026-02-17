/**
 * Derives a short role abbreviation from a job title string.
 * Returns professional abbreviations (PM, SWE, MKT, etc.)
 */
export function deriveRoleAbbrev(role: string): string {
  const lower = role.toLowerCase();

  // C-suite exact matches
  if (/\bceo\b/.test(lower)) return "CEO";
  if (/\bcto\b/.test(lower)) return "CTO";
  if (/\bcfo\b/.test(lower)) return "CFO";
  if (/\bcoo\b/.test(lower)) return "COO";
  if (/\bcmo\b/.test(lower)) return "CMO";
  if (/\bcio\b/.test(lower)) return "CIO";

  // Founder
  if (/founder/.test(lower)) return "FDR";

  // VP / Director / Head
  if (/\bvp\b|vice president/.test(lower)) return "VP";
  if (/director/.test(lower)) return "DIR";

  // Product
  if (/product/.test(lower)) return "PM";

  // Engineering / Development
  if (/frontend|front.end/.test(lower)) return "FE";
  if (/backend|back.end/.test(lower)) return "BE";
  if (/fullstack|full.stack/.test(lower)) return "FS";
  if (/devops|sre|reliability/.test(lower)) return "OPS";
  if (/architect/.test(lower)) return "ARC";
  if (/software|swe\b|develop|program|engineer/.test(lower)) return "SWE";

  // Data / AI
  if (/data scien/.test(lower)) return "DS";
  if (/data analy/.test(lower)) return "DA";
  if (/data engineer/.test(lower)) return "DE";
  if (/machine learn|ml\b|ai\b/.test(lower)) return "ML";
  if (/data/.test(lower)) return "DA";
  if (/analy/.test(lower)) return "ANL";
  if (/research/.test(lower)) return "RES";

  // Design
  if (/design|ux|ui|creative/.test(lower)) return "DES";

  // Marketing / Growth
  if (/market|growth|brand/.test(lower)) return "MKT";
  if (/content/.test(lower)) return "CTN";

  // Sales / Business
  if (/sales/.test(lower)) return "SLS";
  if (/business dev/.test(lower)) return "BDV";
  if (/account/.test(lower)) return "AM";

  // Consulting
  if (/consult|advis/.test(lower)) return "CON";

  // HR / People
  if (/human|people|hr\b|talent|recruit/.test(lower)) return "HR";

  // Finance
  if (/financ|accounting/.test(lower)) return "FIN";

  // Operations
  if (/operat/.test(lower)) return "OPS";

  // Management (generic catch-all)
  if (/manager|lead|principal|\bhead\b/.test(lower)) return "MGR";

  // Legal
  if (/legal|counsel|attorney/.test(lower)) return "LGL";

  // Education
  if (/professor|teacher|instructor|education/.test(lower)) return "EDU";

  return "PRO";
}

/** Gets the first letter of the company name for the badge. */
export function getCompanyInitial(company: string): string {
  return company.trim().charAt(0).toUpperCase() || "?";
}

/** Creates 2-letter initials from a name. */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

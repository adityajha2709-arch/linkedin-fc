import { MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES } from "@/config/constants";

export interface ValidationSuccess {
  valid: true;
  file: File;
  buffer: ArrayBuffer;
}

export interface ValidationFailure {
  valid: false;
  code: "INVALID_FILE_TYPE" | "FILE_TOO_LARGE" | "NO_FILE_PROVIDED";
  message: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export async function validatePdf(
  formData: FormData
): Promise<ValidationResult> {
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return {
      valid: false,
      code: "NO_FILE_PROVIDED",
      message: "No PDF file was provided in the request.",
    };
  }

  if (
    !(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)
  ) {
    return {
      valid: false,
      code: "INVALID_FILE_TYPE",
      message: `Expected a PDF file but received "${file.type || "unknown"}". Please upload a .pdf file.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const maxMB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
    return {
      valid: false,
      code: "FILE_TOO_LARGE",
      message: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the ${maxMB} MB limit.`,
    };
  }

  const buffer = await file.arrayBuffer();

  return { valid: true, file, buffer };
}

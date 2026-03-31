import { ZodError } from "zod";

type FieldErrors = Record<string, string>;

export function mapZodErrors(error: ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0] as string;

    // Only set the first error per field
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}

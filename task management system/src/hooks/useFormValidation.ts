import { ZodObject } from "zod";

export const useFormValidation = <T extends Record<string, any>>(
  schema: ZodObject<any>,
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof T, string>>>>
) => {
  const validateField = (field: keyof T, rawValue: unknown) => {
    let valueToParse: any = rawValue;

    // Example special case (optional)
    if (field === "age") {
      valueToParse = Number(valueToParse);
    }

    const fieldSchema = schema.shape[field as string];
    const result = fieldSchema.safeParse(valueToParse);

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (!result.success) {
        newErrors[field] = result.error.issues[0].message;
      } else {
        delete newErrors[field];
      }

      return newErrors;
    });
  };

  return { validateField };
};

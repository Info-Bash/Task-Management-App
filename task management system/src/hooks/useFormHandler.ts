import { useRef } from "react";

/* export const useFormHandler = <T extends Record<string, any>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  validateField: (field: keyof T, value: string) => void,
  touched: Record<keyof T, boolean>
) => {
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});


  const handleChange =
    <K extends keyof T>(
      field: K,
      sanitize?: (val: string) => string
    ) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = sanitize ? sanitize(e.target.value) : e.target.value;

        setFormData((prev) => ({ ...prev, [field]: value }));

        if (touched[field]) {
          validateField(field, value);
        }

        if (debounceTimers.current[field as string]) {
          clearTimeout(debounceTimers.current[field as string]);
        }

        debounceTimers.current[field as string] = setTimeout(() => {
          validateField(field, value);
        }, 300);
      };

  return { handleChange };
}; */

export const useFormHandler = <T extends Record<string, any>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  touched: Record<keyof T, boolean>,
  setTouched: React.Dispatch<React.SetStateAction<Record<keyof T, boolean>>>,
  validateField: (field: keyof T, value: unknown) => void

) => {
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleChange =
    <K extends keyof T>(field: K, sanitize?: (val: string) => string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = sanitize ? sanitize(e.target.value) : e.target.value;

        setFormData((prev) => ({ ...prev, [field]: value as T[K] }));

        if (touched[field]) validateField(field, value);

        if (debounceTimers.current[field as string]) {
          clearTimeout(debounceTimers.current[field as string]);
        }

        debounceTimers.current[field as string] = setTimeout(() => {
          validateField(field, value);
        }, 300);
      };

  const handleBlur = <K extends keyof T>(field: K, value: unknown) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };


  return { handleChange, handleBlur };
};
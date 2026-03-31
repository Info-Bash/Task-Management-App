import { z } from 'zod';
import { REGISRULES } from './schemasRules';


export const registrationSchema = z.object({
  fullname: z.string()
    .min(REGISRULES.FULL_NAME.min, `Min of ${REGISRULES.FULL_NAME.min} characters`)
    .regex(REGISRULES.FULL_NAME.regex, REGISRULES.FULL_NAME.error)
    .max(REGISRULES.FULL_NAME.max, `Max of ${REGISRULES.FULL_NAME.max} characters`),

  username: z.string()
    .min(REGISRULES.USER_NAME.min, `At least ${REGISRULES.USER_NAME.min} chars`)
    .max(REGISRULES.USER_NAME.max, `Too long maximum of ${REGISRULES.USER_NAME.max}`)
    .regex(REGISRULES.USER_NAME.regex, REGISRULES.USER_NAME.error),

  age: z.number()
    .min(REGISRULES.AGE.min, `User cannot be younger than ${REGISRULES.AGE.min}`)
    .max(REGISRULES.AGE.max, `User cannot be older than ${REGISRULES.AGE.max}`),

  nationalid: z.string()
    .max(REGISRULES.NATIONAL_ID.max, `max of ${REGISRULES.NATIONAL_ID.max} digits`)
    .min(REGISRULES.NATIONAL_ID.min, `max of ${REGISRULES.NATIONAL_ID.min} digits`)
    .regex(REGISRULES.NATIONAL_ID.regex, REGISRULES.NATIONAL_ID.error),

  phonenumber: z.string()
    .length(REGISRULES.PHONE_NUMBER.min, `Must be exactly ${REGISRULES.PHONE_NUMBER.min} digits`)
    .refine((val) => val.startsWith("0"), {
      message: "Phone number must start with 0",
    })
    .regex(REGISRULES.PHONE_NUMBER.regex, REGISRULES.PHONE_NUMBER.error),

  email: z.string()
    .email(REGISRULES.EMAIL.message)
    .regex(REGISRULES.EMAIL.regex, REGISRULES.EMAIL.error),

  gender: z.enum(REGISRULES.GENDER.sex, { message: REGISRULES.GENDER.error }),

  maritalstatus: z.enum(REGISRULES.MARITAL_STATUS.status, { message: REGISRULES.MARITAL_STATUS.error }),

  password: z.string()
    .min(REGISRULES.PASSWORD.min, `Password must be at least ${REGISRULES.PASSWORD.min} characters`)
    .max(REGISRULES.PASSWORD.max, `Password must not exceed ${REGISRULES.PASSWORD.max} characters`)
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[@$!%*?&]/, "Must include a special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

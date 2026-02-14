
import { z } from 'zod';
import { REGISRULES } from './schemasRules';

export const editProfileSchema = z.object({
  fullname: z.string()
    .min(REGISRULES.FULL_NAME.min, `Min of ${REGISRULES.FULL_NAME.min} characters`)
    .regex(REGISRULES.FULL_NAME.regex, REGISRULES.FULL_NAME.error)
    .max(REGISRULES.FULL_NAME.max, `Max of ${REGISRULES.FULL_NAME.max} characters`),

  phonenumber: z.string()
    .length(REGISRULES.PHONE_NUMBER.min, `Must be exactly ${REGISRULES.PHONE_NUMBER.min} digits`)
    .refine((val) => val.startsWith("0"), {
      message: "Phone number must start with 0",
    })
    .regex(REGISRULES.PHONE_NUMBER.regex, REGISRULES.PHONE_NUMBER.error),

  age: z.number()
    .min(REGISRULES.AGE.min, `User cannot be younger than ${REGISRULES.AGE.min}`)
    .max(REGISRULES.AGE.max, `User cannot be older than ${REGISRULES.AGE.max}`),

  maritalstatus: z.enum(REGISRULES.MARITAL_STATUS.status, { message: REGISRULES.MARITAL_STATUS.error }),
});
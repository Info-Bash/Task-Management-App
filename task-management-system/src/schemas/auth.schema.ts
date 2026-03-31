import { z } from 'zod';
import { REGISRULES } from './schemasRules';

export const authSchema = z.object({
  email: z.string()
    .min(1, REGISRULES.EMAIL.requireMsg)
    .email(REGISRULES.EMAIL.message),

  password: z.string()
    .min(1, REGISRULES.PASSWORD.requireMsg),
});
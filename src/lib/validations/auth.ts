import { z } from "zod";

import { m } from "@/lib/i18n/uk";

export const authCredentialsSchema = z.object({
  email: z.email(m.auth.validation.invalidEmail),
  password: z
    .string()
    .min(6, m.auth.validation.passwordMin),
});

export type AuthCredentials = z.infer<typeof authCredentialsSchema>;

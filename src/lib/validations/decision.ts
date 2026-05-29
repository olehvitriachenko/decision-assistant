import { z } from "zod";

import { m } from "@/lib/i18n/uk";

export const createDecisionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, m.decisions.validation.titleRequired)
    .max(200, m.decisions.validation.titleMax),
  situation: z
    .string()
    .trim()
    .min(1, m.decisions.validation.situationRequired)
    .max(5000, m.decisions.validation.situationMax),
  decision: z
    .string()
    .trim()
    .min(1, m.decisions.validation.decisionRequired)
    .max(5000, m.decisions.validation.decisionMax),
  thoughts: z
    .string()
    .trim()
    .max(5000, m.decisions.validation.thoughtsMax)
    .optional()
    .transform((value) => value || undefined),
});

export type CreateDecisionInput = z.infer<typeof createDecisionSchema>;

export function isCreateDecisionFormFilled(input: {
  title: string;
  situation: string;
  decision: string;
}) {
  return (
    input.title.trim().length >= 1 &&
    input.situation.trim().length >= 1 &&
    input.decision.trim().length >= 1
  );
}

import { z } from "zod";

export const createDecisionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  situation: z
    .string()
    .trim()
    .min(1, "Situation is required")
    .max(5000, "Situation must be 5000 characters or less"),
  decision: z
    .string()
    .trim()
    .min(1, "Decision is required")
    .max(5000, "Decision must be 5000 characters or less"),
  thoughts: z
    .string()
    .trim()
    .max(5000, "Thoughts must be 5000 characters or less")
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

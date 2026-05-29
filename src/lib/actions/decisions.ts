"use server";

import { redirect } from "next/navigation";

import { createAnalysis } from "@/lib/db/analyses";
import {
  createDecision as createDecisionRecord,
  updateDecisionStatus,
} from "@/lib/db/decisions";
import { analyzeDecision } from "@/lib/openai/analyze-decision";
import { routes, decisionDetailPath } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";
import { createDecisionSchema } from "@/lib/validations/decision";

export type CreateDecisionActionState = {
  error?: string;
  fieldErrors?: {
    title?: string[];
    situation?: string[];
    decision?: string[];
    thoughts?: string[];
  };
};

function parseDecisionFormData(formData: FormData) {
  const thoughts = formData.get("thoughts");

  return createDecisionSchema.safeParse({
    title: formData.get("title"),
    situation: formData.get("situation"),
    decision: formData.get("decision"),
    thoughts: typeof thoughts === "string" && thoughts.length > 0 ? thoughts : undefined,
  });
}

export async function createDecision(
  _prevState: CreateDecisionActionState,
  formData: FormData
): Promise<CreateDecisionActionState> {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  const parsed = parseDecisionFormData(formData);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let decision;

  try {
    decision = await createDecisionRecord(user.id, parsed.data);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create decision. Please try again.",
    };
  }

  try {
    const analysis = await analyzeDecision({
      title: decision.title,
      situation: decision.situation,
      decision: decision.decision,
      thoughts: decision.thoughts ?? undefined,
    });

    await createAnalysis({
      decisionId: decision.id,
      category: analysis.category,
      confidence: analysis.confidence,
      biases: analysis.biases,
      alternatives: analysis.alternatives,
      summary: analysis.summary,
    });

    await updateDecisionStatus(decision.id, "completed");
  } catch {
    try {
      await updateDecisionStatus(decision.id, "failed");
    } catch {
      // Decision remains in processing if status update fails.
    }
  }

  redirect(decisionDetailPath(decision.id));
}

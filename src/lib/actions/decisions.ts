"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAnalysis,
  getAnalysisByDecisionId,
} from "@/lib/db/analyses";
import {
  createDecision as createDecisionRecord,
  getDecisionById,
  updateDecisionStatus,
} from "@/lib/db/decisions";
import { analyzeDecision } from "@/lib/openai/analyze-decision";
import { routes, decisionDetailPath } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";
import type { Decision } from "@/lib/types/decision";
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

export type ReanalyzeDecisionActionState = {
  error?: string;
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

async function runAnalysisPipeline(
  decision: Decision
): Promise<{ success: true } | { success: false }> {
  const current = await getDecisionById(decision.id);

  if (!current || current.status !== "processing") {
    return current?.status === "completed"
      ? { success: true }
      : { success: false };
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
    return { success: true };
  } catch {
    try {
      await updateDecisionStatus(decision.id, "failed");
    } catch {
      // Decision remains in processing if status update fails.
    }

    return { success: false };
  }
}

function scheduleAnalysisInBackground(decision: Decision) {
  after(async () => {
    await runAnalysisPipeline(decision);
    revalidatePath(decisionDetailPath(decision.id));
    revalidatePath(routes.dashboard);
    revalidatePath(routes.decisions);
  });
}

export async function reanalyzeDecision(
  decisionId: string
): Promise<ReanalyzeDecisionActionState> {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  const decision = await getDecisionById(decisionId);

  if (!decision || decision.user_id !== user.id) {
    return { error: "Decision not found." };
  }

  try {
    await updateDecisionStatus(decisionId, "processing");
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to start analysis. Please try again.",
    };
  }

  scheduleAnalysisInBackground(decision);

  return {};
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

  scheduleAnalysisInBackground(decision);

  redirect(decisionDetailPath(decision.id));
}

export async function resumePendingAnalysis(decisionId: string): Promise<void> {
  const user = await getUser();

  if (!user) {
    return;
  }

  const decision = await getDecisionById(decisionId);

  if (!decision || decision.user_id !== user.id || decision.status !== "processing") {
    return;
  }

  const existingAnalysis = await getAnalysisByDecisionId(decisionId);

  if (existingAnalysis) {
    return;
  }

  await runAnalysisPipeline(decision);
  revalidatePath(decisionDetailPath(decisionId));
  revalidatePath(routes.dashboard);
  revalidatePath(routes.decisions);
}

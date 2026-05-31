"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  ANALYSIS_LOCK_STALE_SECONDS,
  ANALYSIS_RECOVERY_MS,
  PROCESSING_STALE_MS,
  STATUS_UPDATE_MAX_ATTEMPTS,
} from "@/lib/config/analysis";
import {
  getAnalysisByDecisionId,
  getAnalysisByDecisionIdAdmin,
  insertAnalysisIfGenerationMatches,
} from "@/lib/db/analyses";
import {
  claimDecisionAnalysisLock,
  createDecision as createDecisionRecord,
  deleteDecisionById,
  getDecisionById,
  getDecisionByIdAdmin,
  releaseDecisionAnalysisLock,
  resetDecisionAnalysis,
  updateDecisionStatus,
} from "@/lib/db/decisions";
import { analyzeDecision } from "@/lib/openai/analyze-decision";
import { routes, decisionDetailPath } from "@/lib/config/routes";
import { logServerError } from "@/lib/errors/public-messages";
import { m } from "@/lib/i18n/uk";
import { getUser } from "@/lib/supabase/auth";
import type { Decision, DecisionStatus } from "@/lib/types/decision";
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

export type DeleteDecisionActionState = {
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

function revalidateDecisionPaths(decisionId: string) {
  revalidatePath(decisionDetailPath(decisionId));
  revalidatePath(routes.dashboard);
  revalidatePath(routes.decisions);
}

async function updateDecisionStatusWithRetry(
  decisionId: string,
  status: DecisionStatus
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < STATUS_UPDATE_MAX_ATTEMPTS; attempt += 1) {
    try {
      await updateDecisionStatus(decisionId, status);
      return true;
    } catch (error) {
      lastError = error;
    }
  }

  console.error(
    `Failed to update decision ${decisionId} to ${status} after ${STATUS_UPDATE_MAX_ATTEMPTS} attempts.`,
    lastError
  );

  return false;
}

async function syncCompletedDecision(decisionId: string) {
  const updated = await updateDecisionStatusWithRetry(decisionId, "completed");

  if (updated) {
    revalidateDecisionPaths(decisionId);
  }

  return updated;
}

function getProcessingAgeMs(decision: Decision) {
  const ageMs = Date.now() - Date.parse(decision.updated_at);

  return Number.isFinite(ageMs) ? ageMs : null;
}

function isProcessingStale(decision: Decision) {
  const ageMs = getProcessingAgeMs(decision);

  return ageMs !== null && ageMs >= PROCESSING_STALE_MS;
}

function isProcessingNeedsRecovery(decision: Decision) {
  const ageMs = getProcessingAgeMs(decision);

  return ageMs !== null && ageMs >= ANALYSIS_RECOVERY_MS;
}

function isAnalysisLockActive(decision: Decision) {
  if (!decision.analysis_locked_at) {
    return false;
  }

  const lockAgeMs = Date.now() - Date.parse(decision.analysis_locked_at);

  if (!Number.isFinite(lockAgeMs) || lockAgeMs < 0) {
    return false;
  }

  return lockAgeMs < ANALYSIS_LOCK_STALE_SECONDS * 1000;
}

async function shouldMarkRecoveryFailed(decisionId: string) {
  const current = await getDecisionByIdAdmin(decisionId);

  if (!current || current.status !== "processing") {
    return false;
  }

  if (await getAnalysisByDecisionIdAdmin(decisionId)) {
    return false;
  }

  if (!isProcessingStale(current)) {
    return false;
  }

  if (isAnalysisLockActive(current)) {
    return false;
  }

  return true;
}

async function isAnalysisGenerationCurrent(
  decisionId: string,
  generation: number
): Promise<boolean> {
  const current = await getDecisionByIdAdmin(decisionId);

  return (
    current?.status === "processing" && current.analysis_generation === generation
  );
}

async function runAnalysisPipeline(
  decision: Decision,
  options: { forceReanalysis?: boolean } = {}
): Promise<{ success: true } | { success: false }> {
  const current = await getDecisionByIdAdmin(decision.id);

  if (!current) {
    return { success: false };
  }

  if (current.status === "completed" && !options.forceReanalysis) {
    return { success: true };
  }

  if (current.status !== "processing") {
    return { success: false };
  }

  const existingAnalysis = await getAnalysisByDecisionIdAdmin(decision.id);

  if (existingAnalysis && !options.forceReanalysis) {
    await syncCompletedDecision(decision.id);
    return { success: true };
  }

  const claim = await claimDecisionAnalysisLock(
    decision.id,
    ANALYSIS_LOCK_STALE_SECONDS
  );

  if (!claim.claimed) {
    const latestAnalysis = await getAnalysisByDecisionIdAdmin(decision.id);

    if (latestAnalysis && !options.forceReanalysis) {
      await syncCompletedDecision(decision.id);
      return { success: true };
    }

    return { success: false };
  }

  const claimedGeneration = claim.generation;

  try {
    if (!(await isAnalysisGenerationCurrent(decision.id, claimedGeneration))) {
      return { success: false };
    }

    const analysis = await analyzeDecision({
      title: decision.title,
      situation: decision.situation,
      decision: decision.decision,
      thoughts: decision.thoughts ?? undefined,
    });

    if (!(await isAnalysisGenerationCurrent(decision.id, claimedGeneration))) {
      return { success: false };
    }

    const analysisId = await insertAnalysisIfGenerationMatches({
      decisionId: decision.id,
      expectedGeneration: claimedGeneration,
      category: analysis.category,
      confidence: analysis.confidence,
      biases: analysis.biases,
      alternatives: analysis.alternatives,
      summary: analysis.summary,
    });

    if (!analysisId) {
      const insertedByAnotherWorker = await getAnalysisByDecisionIdAdmin(
        decision.id
      );

      if (insertedByAnotherWorker) {
        await syncCompletedDecision(decision.id);
        return { success: true };
      }

      return { success: false };
    }

    const updated = await updateDecisionStatusWithRetry(decision.id, "completed");

    return updated ? { success: true } : { success: false };
  } catch (error) {
    logServerError(`Analysis pipeline failed for decision ${decision.id}`, error);

    if (await isAnalysisGenerationCurrent(decision.id, claimedGeneration)) {
      await updateDecisionStatusWithRetry(decision.id, "failed");
    }

    return { success: false };
  } finally {
    await releaseDecisionAnalysisLock(decision.id);
  }
}

function scheduleAnalysisInBackground(
  decision: Decision,
  options: { forceReanalysis?: boolean } = {}
) {
  after(async () => {
    await runAnalysisPipeline(decision, options);
    revalidateDecisionPaths(decision.id);
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
    return { error: m.decisions.errors.notFound };
  }

  try {
    await resetDecisionAnalysis(decisionId);
  } catch (error) {
    logServerError(`Failed to reset analysis for decision ${decisionId}`, error);
    return { error: m.decisions.errors.analysisStartFailed };
  }

  const refreshedDecision = await getDecisionById(decisionId);

  if (!refreshedDecision) {
    return { error: m.decisions.errors.notFound };
  }

  revalidateDecisionPaths(decisionId);
  scheduleAnalysisInBackground(refreshedDecision, { forceReanalysis: true });

  return {};
}

export async function deleteDecision(
  decisionId: string
): Promise<DeleteDecisionActionState> {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  const decision = await getDecisionById(decisionId);

  if (!decision || decision.user_id !== user.id) {
    return { error: m.decisions.errors.notFound };
  }

  try {
    await deleteDecisionById(decisionId);
  } catch (error) {
    logServerError(`Failed to delete decision ${decisionId}`, error);
    return { error: m.decisions.errors.deleteFailed };
  }

  revalidatePath(routes.dashboard);
  revalidatePath(routes.decisions);
  redirect(routes.decisions);
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
    logServerError("Failed to create decision", error);
    return { error: m.decisions.errors.createFailed };
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
    await syncCompletedDecision(decisionId);
    return;
  }

  if (!isProcessingNeedsRecovery(decision)) {
    return;
  }

  const result = await runAnalysisPipeline(decision);

  if (!result.success && (await shouldMarkRecoveryFailed(decisionId))) {
    await updateDecisionStatusWithRetry(decisionId, "failed");
  }

  revalidateDecisionPaths(decisionId);
}

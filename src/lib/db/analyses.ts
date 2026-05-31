import { analysesTableName } from "@/lib/config/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  Analysis,
  InsertAnalysisIfGenerationMatchesInput,
} from "@/lib/types/analysis";

export async function insertAnalysisIfGenerationMatches(
  input: InsertAnalysisIfGenerationMatchesInput
): Promise<string | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc(
    "insert_decision_analysis_if_generation_matches",
    {
      p_decision_id: input.decisionId,
      p_expected_generation: input.expectedGeneration,
      p_category: input.category,
      p_confidence: input.confidence,
      p_biases: input.biases,
      p_alternatives: input.alternatives,
      p_summary: input.summary,
    }
  );

  if (error) {
    const dbError = new Error(error.message) as Error & { code?: string };
    dbError.code = error.code;
    throw dbError;
  }

  return typeof data === "string" ? data : null;
}

export async function getLatestAnalysesWithBiasesByDecisionIds(
  decisionIds: string[]
): Promise<
  Map<
    string,
    { category: string; confidence: number; biases: string[]; created_at: string }
  >
> {
  if (decisionIds.length === 0) {
    return new Map();
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from(analysesTableName)
    .select("decision_id, category, confidence, biases, created_at")
    .in("decision_id", decisionIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const latestByDecisionId = new Map<
    string,
    { category: string; confidence: number; biases: string[]; created_at: string }
  >();

  for (const row of data ?? []) {
    if (!latestByDecisionId.has(row.decision_id)) {
      latestByDecisionId.set(row.decision_id, {
        category: row.category,
        confidence: row.confidence,
        biases: row.biases as string[],
        created_at: row.created_at,
      });
    }
  }

  return latestByDecisionId;
}

export async function getAnalysisByDecisionId(
  decisionId: string
): Promise<Analysis | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(analysesTableName)
    .select("*")
    .eq("decision_id", decisionId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    biases: data.biases as string[],
    alternatives: data.alternatives as string[],
  };
}

export async function getAnalysisByDecisionIdAdmin(
  decisionId: string
): Promise<Analysis | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from(analysesTableName)
    .select("*")
    .eq("decision_id", decisionId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    biases: data.biases as string[],
    alternatives: data.alternatives as string[],
  };
}

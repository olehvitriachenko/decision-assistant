import { analysesTableName } from "@/lib/config/database";
import { createClient } from "@/lib/supabase/server";
import type { Analysis, CreateAnalysisInput } from "@/lib/types/analysis";

export async function createAnalysis(
  input: CreateAnalysisInput
): Promise<Analysis> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(analysesTableName)
    .insert({
      decision_id: input.decisionId,
      category: input.category,
      confidence: input.confidence,
      biases: input.biases,
      alternatives: input.alternatives,
      summary: input.summary,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    biases: data.biases as string[],
    alternatives: data.alternatives as string[],
  };
}

export async function getLatestAnalysesByDecisionIds(
  decisionIds: string[]
): Promise<
  Map<string, { category: string; confidence: number; created_at: string }>
> {
  if (decisionIds.length === 0) {
    return new Map();
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from(analysesTableName)
    .select("decision_id, category, confidence, created_at")
    .in("decision_id", decisionIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const latestByDecisionId = new Map<
    string,
    { category: string; confidence: number; created_at: string }
  >();

  for (const row of data ?? []) {
    if (!latestByDecisionId.has(row.decision_id)) {
      latestByDecisionId.set(row.decision_id, {
        category: row.category,
        confidence: row.confidence,
        created_at: row.created_at,
      });
    }
  }

  return latestByDecisionId;
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

export async function deleteAnalysesByDecisionId(decisionId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from(analysesTableName)
    .delete()
    .eq("decision_id", decisionId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getAnalysisByDecisionId(
  decisionId: string
): Promise<Analysis | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(analysesTableName)
    .select("*")
    .eq("decision_id", decisionId)
    .order("created_at", { ascending: false })
    .limit(1)
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

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

import { createClient } from "@/lib/supabase/server";
import type { CreateDecisionInput } from "@/lib/validations/decision";
import type { Decision, DecisionListItem } from "@/lib/types/decision";

export async function getDecisionsByUserId(
  userId: string
): Promise<DecisionListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("decisions")
    .select("id, title, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createDecision(
  userId: string,
  input: CreateDecisionInput
): Promise<Decision> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("decisions")
    .insert({
      user_id: userId,
      title: input.title,
      situation: input.situation,
      decision: input.decision,
      thoughts: input.thoughts ?? null,
      status: "processing",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

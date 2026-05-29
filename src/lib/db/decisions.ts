import { decisionsTableName } from "@/lib/config/database";
import { createClient } from "@/lib/supabase/server";
import type { CreateDecisionInput } from "@/lib/validations/decision";
import type { Decision, DecisionListItem, DecisionStatus } from "@/lib/types/decision";

export const DECISIONS_PAGE_SIZE = 10;

export type PaginatedDecisions = {
  decisions: DecisionListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getDecisionsByUserIdPaginated(
  userId: string,
  page: number,
  pageSize = DECISIONS_PAGE_SIZE
): Promise<PaginatedDecisions> {
  const supabase = await createClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from(decisionsTableName)
    .select("id, title, status, created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    decisions: data ?? [],
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getDecisionById(
  decisionId: string
): Promise<Decision | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(decisionsTableName)
    .select("*")
    .eq("id", decisionId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createDecision(
  userId: string,
  input: CreateDecisionInput
): Promise<Decision> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(decisionsTableName)
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

export async function updateDecisionStatus(
  decisionId: string,
  status: DecisionStatus
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from(decisionsTableName)
    .update({ status })
    .eq("id", decisionId);

  if (error) {
    throw new Error(error.message);
  }
}

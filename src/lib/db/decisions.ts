import {
  type DecisionListQuery,
  DEFAULT_DECISION_LIST_QUERY,
} from "@/lib/config/decision-list-params";
import { getCategoryLabel, getCategorySlug } from "@/lib/categories/registry";
import { decisionsTableName } from "@/lib/config/database";
import { getLatestAnalysesWithBiasesByDecisionIds } from "@/lib/db/analyses";
import { normalizeBias } from "@/lib/normalize-bias";
import { getSupportLevel } from "@/lib/support-score";
import { createAdminClient } from "@/lib/supabase/admin";
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
  query: DecisionListQuery;
};

export type DecisionSupportStats = {
  total: number;
  highSupport: number;
  mediumSupport: number;
  lowSupport: number;
};

export type DashboardFrequencyItem = {
  label: string;
  count: number;
  key?: string;
};

export type DecisionDashboardInsights = {
  analyzedCount: number;
  categories: DashboardFrequencyItem[];
  biases: DashboardFrequencyItem[];
  supportDistribution: {
    high: number;
    medium: number;
    low: number;
  };
};

export type DecisionBiasFilterOption = {
  key: string;
  label: string;
  count: number;
};

const DASHBOARD_INSIGHTS_LIMIT = 6;

function formatCategoryLabel(value: string) {
  return getCategoryLabel(value);
}

function countCategoryFrequencies(values: string[]) {
  const counts = new Map<string, { label: string; count: number }>();

  for (const value of values) {
    const key = getCategorySlug(value);

    if (!key) {
      continue;
    }

    const existing = counts.get(key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(key, {
      label: formatCategoryLabel(value),
      count: 1,
    });
  }

  return [...counts.values()].sort((a, b) => {
    const countDiff = b.count - a.count;

    return countDiff !== 0 ? countDiff : a.label.localeCompare(b.label);
  });
}

function countBiasFrequencies(values: string[]) {
  const counts = new Map<string, { key: string; label: string; count: number }>();

  for (const value of values) {
    const normalized = normalizeBias(value);

    if (!normalized) {
      continue;
    }

    const existing = counts.get(normalized.key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    counts.set(normalized.key, {
      key: normalized.key,
      label: normalized.label,
      count: 1,
    });
  }

  return [...counts.values()].sort((a, b) => {
    const countDiff = b.count - a.count;

    return countDiff !== 0 ? countDiff : a.label.localeCompare(b.label);
  });
}

type DecisionRow = Pick<
  Decision,
  "id" | "title" | "decision" | "status" | "created_at"
>;

type DecisionListRpcRow = DecisionRow & {
  analysis_category: string | null;
  analysis_confidence: number | null;
  analysis_bias_count: number | null;
  total_count: number;
};

async function fetchDecisionRows(userId: string): Promise<DecisionRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(decisionsTableName)
    .select("id, title, decision, status, created_at")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getDecisionsByUserIdPaginated(
  userId: string,
  page: number,
  pageSize = DECISIONS_PAGE_SIZE,
  query: DecisionListQuery = DEFAULT_DECISION_LIST_QUERY
): Promise<PaginatedDecisions> {
  const supabase = await createClient();
  const safePage = Math.max(1, page);

  const { data, error } = await supabase.rpc("list_decisions_paginated", {
    p_page: safePage,
    p_page_size: pageSize,
    p_sort: query.sort,
    p_status: query.status,
    p_category: query.category,
    p_bias: query.bias,
  });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as DecisionListRpcRow[];
  const total = rows[0]?.total_count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    decisions: rows.map(({ total_count: _totalCount, ...decision }) => decision),
    total,
    page: safePage,
    pageSize,
    totalPages,
    query,
  };
}

export async function getDecisionBiasFilterOptions(
  userId: string
): Promise<DecisionBiasFilterOption[]> {
  void userId;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_decision_bias_filter_options");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((row: { bias_key: string; bias_count: number }) => {
      const normalized = normalizeBias(row.bias_key);

      if (!normalized) {
        return null;
      }

      return {
        key: normalized.key,
        label: normalized.label,
        count: row.bias_count,
      } satisfies DecisionBiasFilterOption;
    })
    .filter((option: DecisionBiasFilterOption | null): option is DecisionBiasFilterOption => {
      return option !== null;
    });
}

export async function getDecisionSupportStats(
  userId: string
): Promise<DecisionSupportStats> {
  void userId;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_decision_support_stats");

  if (error) {
    throw new Error(error.message);
  }

  const row = (data?.[0] ?? {
    total: 0,
    high_support: 0,
    medium_support: 0,
    low_support: 0,
  }) as {
    total: number;
    high_support: number;
    medium_support: number;
    low_support: number;
  };

  return {
    total: Number(row.total),
    highSupport: Number(row.high_support),
    mediumSupport: Number(row.medium_support),
    lowSupport: Number(row.low_support),
  };
}

export async function getDecisionDashboardInsights(
  userId: string
): Promise<DecisionDashboardInsights> {
  const decisions = await fetchDecisionRows(userId);
  const analysesByDecisionId = await getLatestAnalysesWithBiasesByDecisionIds(
    decisions.map((decision) => decision.id)
  );

  const categories: string[] = [];
  const biases: string[] = [];
  let highSupport = 0;
  let mediumSupport = 0;
  let lowSupport = 0;

  for (const analysis of analysesByDecisionId.values()) {
    categories.push(analysis.category);

    for (const bias of analysis.biases) {
      biases.push(bias);
    }

    const level = getSupportLevel(analysis.confidence);

    if (level === "high") {
      highSupport += 1;
    } else if (level === "medium") {
      mediumSupport += 1;
    } else {
      lowSupport += 1;
    }
  }

  return {
    analyzedCount: analysesByDecisionId.size,
    categories: countCategoryFrequencies(categories).slice(
      0,
      DASHBOARD_INSIGHTS_LIMIT
    ),
    biases: countBiasFrequencies(biases).slice(0, DASHBOARD_INSIGHTS_LIMIT),
    supportDistribution: {
      high: highSupport,
      medium: mediumSupport,
      low: lowSupport,
    },
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
  const supabase = createAdminClient();

  const { error } = await supabase
    .from(decisionsTableName)
    .update({ status })
    .eq("id", decisionId);

  if (error) {
    throw new Error(error.message);
  }
}

export type AnalysisClaimResult = {
  claimed: boolean;
  generation: number;
};

export async function getDecisionByIdAdmin(
  decisionId: string
): Promise<Decision | null> {
  const supabase = createAdminClient();

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

export async function claimDecisionAnalysisLock(
  decisionId: string,
  lockStaleSeconds: number
): Promise<AnalysisClaimResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("claim_decision_analysis_lock", {
    p_decision_id: decisionId,
    p_lock_stale_seconds: lockStaleSeconds,
  });

  if (error) {
    throw new Error(error.message);
  }

  const row = (data?.[0] ?? { claimed: false, generation: 0 }) as {
    claimed: boolean;
    generation: number;
  };

  return {
    claimed: Boolean(row.claimed),
    generation: Number(row.generation),
  };
}

export async function releaseDecisionAnalysisLock(
  decisionId: string
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.rpc("release_decision_analysis_lock", {
    p_decision_id: decisionId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function bumpDecisionAnalysisGeneration(
  decisionId: string
): Promise<number> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("bump_decision_analysis_generation", {
    p_decision_id: decisionId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return Number(data ?? 0);
}

export async function deleteDecisionById(decisionId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from(decisionsTableName)
    .delete()
    .eq("id", decisionId);

  if (error) {
    throw new Error(error.message);
  }
}

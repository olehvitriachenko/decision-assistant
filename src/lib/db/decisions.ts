import {
  type DecisionCategoryFilter,
  decisionCategoryFilterLabels,
  type DecisionListQuery,
  type DecisionSortOption,
  DEFAULT_DECISION_LIST_QUERY,
  matchesDecisionCategoryFilter,
  statusFilterToDecisionStatus,
} from "@/lib/config/decision-list-params";
import { decisionsTableName } from "@/lib/config/database";
import {
  getLatestAnalysesByDecisionIds,
  getLatestAnalysesWithBiasesByDecisionIds,
} from "@/lib/db/analyses";
import { normalizeDecisionCategory } from "@/lib/config/decision-list-params";
import { normalizeBias } from "@/lib/normalize-bias";
import { getSupportLevel } from "@/lib/support-score";
import { getDecisionComplexityScore } from "@/lib/decision-complexity";
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

type AnalysisSummary = {
  category: string;
  confidence: number;
  biases: string[];
  created_at: string;
};

const DASHBOARD_INSIGHTS_LIMIT = 6;

function formatCategoryLabel(value: string) {
  const key = normalizeDecisionCategory(value);
  const knownLabel =
    key in decisionCategoryFilterLabels
      ? decisionCategoryFilterLabels[key as DecisionCategoryFilter]
      : null;

  if (knownLabel && key !== "all") {
    return knownLabel;
  }

  return key
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function countCategoryFrequencies(values: string[]) {
  const counts = new Map<string, { label: string; count: number }>();

  for (const value of values) {
    const key = normalizeDecisionCategory(value);

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
  "id" | "title" | "status" | "created_at"
>;

function needsAnalysisAwareQuery(query: DecisionListQuery) {
  return (
    query.sort === "confidence_high" ||
    query.sort === "confidence_low" ||
    query.sort === "complexity_high" ||
    query.sort === "complexity_low" ||
    query.category !== "all" ||
    query.bias !== "all"
  );
}

function attachLatestAnalyses(
  decisions: DecisionRow[],
  analysesByDecisionId: Map<
    string,
    { category: string; confidence: number; created_at: string }
  >
): DecisionListItem[] {
  return decisions.map((decision) => {
    const analysis = analysesByDecisionId.get(decision.id);

    return {
      ...decision,
      analysis_category: analysis?.category ?? null,
      analysis_confidence: analysis?.confidence ?? null,
      analysis_bias_count: null,
    };
  });
}

function attachLatestAnalysesWithBiases(
  decisions: DecisionRow[],
  analysesByDecisionId: Map<string, AnalysisSummary>
): DecisionListItem[] {
  return decisions.map((decision) => {
    const analysis = analysesByDecisionId.get(decision.id);

    return {
      ...decision,
      analysis_category: analysis?.category ?? null,
      analysis_confidence: analysis?.confidence ?? null,
      analysis_bias_count: analysis?.biases.length ?? null,
    };
  });
}

function filterByCategory(
  decisions: DecisionListItem[],
  category: DecisionCategoryFilter
) {
  if (category === "all") {
    return decisions;
  }

  return decisions.filter((decision) =>
    matchesDecisionCategoryFilter(decision.analysis_category, category)
  );
}

function filterByBias(
  decisions: DecisionListItem[],
  biasFilter: string,
  analysesByDecisionId: Map<string, AnalysisSummary>
) {
  if (biasFilter === "all") {
    return decisions;
  }

  return decisions.filter((decision) => {
    const analysis = analysesByDecisionId.get(decision.id);

    if (!analysis) {
      return false;
    }

    return analysis.biases.some((bias) => normalizeBias(bias)?.key === biasFilter);
  });
}

function compareByCreatedAtDesc(a: DecisionListItem, b: DecisionListItem) {
  return b.created_at.localeCompare(a.created_at);
}

function sortDecisions(
  decisions: DecisionListItem[],
  sort: DecisionSortOption
) {
  const sorted = [...decisions];

  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => a.created_at.localeCompare(b.created_at));
    case "confidence_high":
      return sorted.sort((a, b) => {
        const scoreDiff =
          (b.analysis_confidence ?? -1) - (a.analysis_confidence ?? -1);

        return scoreDiff !== 0 ? scoreDiff : compareByCreatedAtDesc(a, b);
      });
    case "confidence_low":
      return sorted.sort((a, b) => {
        const scoreDiff =
          (a.analysis_confidence ?? 101) - (b.analysis_confidence ?? 101);

        return scoreDiff !== 0 ? scoreDiff : compareByCreatedAtDesc(a, b);
      });
    case "complexity_high":
      return sorted.sort((a, b) => {
        const scoreDiff =
          (getDecisionComplexityScore(
            b.analysis_confidence,
            b.analysis_bias_count
          ) ?? -1) -
          (getDecisionComplexityScore(
            a.analysis_confidence,
            a.analysis_bias_count
          ) ?? -1);

        return scoreDiff !== 0 ? scoreDiff : compareByCreatedAtDesc(a, b);
      });
    case "complexity_low":
      return sorted.sort((a, b) => {
        const scoreDiff =
          (getDecisionComplexityScore(
            a.analysis_confidence,
            a.analysis_bias_count
          ) ?? 101) -
          (getDecisionComplexityScore(
            b.analysis_confidence,
            b.analysis_bias_count
          ) ?? 101);

        return scoreDiff !== 0 ? scoreDiff : compareByCreatedAtDesc(a, b);
      });
    case "title_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title_desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
    default:
      return sorted.sort(compareByCreatedAtDesc);
  }
}

function paginateDecisions<T>(items: T[], page: number, pageSize: number) {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;

  return {
    items: items.slice(from, from + pageSize),
    page: safePage,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

async function fetchDecisionRows(
  userId: string,
  query: DecisionListQuery
): Promise<DecisionRow[]> {
  const supabase = await createClient();
  const status = statusFilterToDecisionStatus(query.status);

  let request = supabase
    .from(decisionsTableName)
    .select("id, title, status, created_at")
    .eq("user_id", userId);

  if (status) {
    request = request.eq("status", status);
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

async function getDecisionsWithAnalysisQuery(
  userId: string,
  page: number,
  pageSize: number,
  query: DecisionListQuery
): Promise<PaginatedDecisions> {
  const decisions = await fetchDecisionRows(userId, query);
  const analysesByDecisionId = await getLatestAnalysesWithBiasesByDecisionIds(
    decisions.map((decision) => decision.id)
  );

  const enriched = attachLatestAnalysesWithBiases(decisions, analysesByDecisionId);
  const filteredByCategory = filterByCategory(enriched, query.category);
  const filtered = filterByBias(filteredByCategory, query.bias, analysesByDecisionId);
  const sorted = sortDecisions(filtered, query.sort);
  const paginated = paginateDecisions(sorted, page, pageSize);

  return {
    decisions: paginated.items,
    total: paginated.total,
    page: paginated.page,
    pageSize,
    totalPages: paginated.totalPages,
    query,
  };
}

async function getDecisionsWithSqlPagination(
  userId: string,
  page: number,
  pageSize: number,
  query: DecisionListQuery
): Promise<PaginatedDecisions> {
  const supabase = await createClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;
  const status = statusFilterToDecisionStatus(query.status);

  let request = supabase
    .from(decisionsTableName)
    .select("id, title, status, created_at", { count: "exact" })
    .eq("user_id", userId);

  if (status) {
    request = request.eq("status", status);
  }

  switch (query.sort) {
    case "oldest":
      request = request.order("created_at", { ascending: true });
      break;
    case "title_asc":
      request = request.order("title", { ascending: true });
      break;
    case "title_desc":
      request = request.order("title", { ascending: false });
      break;
    case "newest":
    default:
      request = request.order("created_at", { ascending: false });
      break;
  }

  const { data, error, count } = await request.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const analysesByDecisionId = await getLatestAnalysesByDecisionIds(
    (data ?? []).map((decision) => decision.id)
  );

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    decisions: attachLatestAnalyses(data ?? [], analysesByDecisionId),
    total,
    page: safePage,
    pageSize,
    totalPages,
    query,
  };
}

export async function getDecisionsByUserIdPaginated(
  userId: string,
  page: number,
  pageSize = DECISIONS_PAGE_SIZE,
  query: DecisionListQuery = DEFAULT_DECISION_LIST_QUERY
): Promise<PaginatedDecisions> {
  if (needsAnalysisAwareQuery(query)) {
    return getDecisionsWithAnalysisQuery(userId, page, pageSize, query);
  }

  return getDecisionsWithSqlPagination(userId, page, pageSize, query);
}

export async function getDecisionBiasFilterOptions(
  userId: string
): Promise<DecisionBiasFilterOption[]> {
  const decisions = await fetchDecisionRows(userId, DEFAULT_DECISION_LIST_QUERY);
  const analysesByDecisionId = await getLatestAnalysesWithBiasesByDecisionIds(
    decisions.map((decision) => decision.id)
  );

  const biases: string[] = [];

  for (const analysis of analysesByDecisionId.values()) {
    biases.push(...analysis.biases);
  }

  return countBiasFrequencies(biases);
}

export async function getDecisionSupportStats(
  userId: string
): Promise<DecisionSupportStats> {
  const decisions = await fetchDecisionRows(userId, DEFAULT_DECISION_LIST_QUERY);
  const analysesByDecisionId = await getLatestAnalysesByDecisionIds(
    decisions.map((decision) => decision.id)
  );

  let highSupport = 0;
  let mediumSupport = 0;
  let lowSupport = 0;

  for (const decision of decisions) {
    const confidence = analysesByDecisionId.get(decision.id)?.confidence;

    if (confidence === undefined) {
      continue;
    }

    if (confidence >= 70) {
      highSupport += 1;
      continue;
    }

    if (confidence >= 40) {
      mediumSupport += 1;
      continue;
    }

    lowSupport += 1;
  }

  return {
    total: decisions.length,
    highSupport,
    mediumSupport,
    lowSupport,
  };
}

export async function getDecisionDashboardInsights(
  userId: string
): Promise<DecisionDashboardInsights> {
  const decisions = await fetchDecisionRows(userId, DEFAULT_DECISION_LIST_QUERY);
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
  const supabase = await createClient();

  const { error } = await supabase
    .from(decisionsTableName)
    .update({ status })
    .eq("id", decisionId);

  if (error) {
    throw new Error(error.message);
  }
}

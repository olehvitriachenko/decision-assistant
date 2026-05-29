import {
  type DecisionCategoryFilter,
  type DecisionListQuery,
  type DecisionSortOption,
  DEFAULT_DECISION_LIST_QUERY,
  matchesDecisionCategoryFilter,
  statusFilterToDecisionStatus,
} from "@/lib/config/decision-list-params";
import { decisionsTableName } from "@/lib/config/database";
import { getLatestAnalysesByDecisionIds } from "@/lib/db/analyses";
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

type DecisionRow = Pick<
  Decision,
  "id" | "title" | "status" | "created_at"
>;

function needsAnalysisAwareQuery(query: DecisionListQuery) {
  return (
    query.sort === "confidence_high" ||
    query.sort === "confidence_low" ||
    query.category !== "all"
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

        return scoreDiff !== 0
          ? scoreDiff
          : b.created_at.localeCompare(a.created_at);
      });
    case "confidence_low":
      return sorted.sort((a, b) => {
        const scoreDiff =
          (a.analysis_confidence ?? 101) - (b.analysis_confidence ?? 101);

        return scoreDiff !== 0
          ? scoreDiff
          : b.created_at.localeCompare(a.created_at);
      });
    case "title_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title_desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
    default:
      return sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
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
  const analysesByDecisionId = await getLatestAnalysesByDecisionIds(
    decisions.map((decision) => decision.id)
  );

  const enriched = attachLatestAnalyses(decisions, analysesByDecisionId);
  const filtered = filterByCategory(enriched, query.category);
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

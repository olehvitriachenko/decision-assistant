import { routes } from "@/lib/config/routes";
import type { DecisionStatus } from "@/lib/types/decision";

export const decisionSortOptions = [
  "newest",
  "oldest",
  "confidence_high",
  "confidence_low",
  "title_asc",
  "title_desc",
] as const;

export type DecisionSortOption = (typeof decisionSortOptions)[number];

export const DEFAULT_DECISION_SORT: DecisionSortOption = "newest";

export const decisionSortLabels: Record<DecisionSortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  confidence_high: "Highest Support Score",
  confidence_low: "Lowest Support Score",
  title_asc: "Title A → Z",
  title_desc: "Title Z → A",
};

export const decisionStatusFilterOptions = [
  "all",
  "completed",
  "processing",
  "failed",
] as const;

export type DecisionStatusFilter =
  (typeof decisionStatusFilterOptions)[number];

export const DEFAULT_DECISION_STATUS_FILTER: DecisionStatusFilter = "all";

export const decisionStatusFilterLabels: Record<
  DecisionStatusFilter,
  string
> = {
  all: "All",
  completed: "Completed",
  processing: "Processing",
  failed: "Failed",
};

export const decisionCategoryFilterOptions = [
  "all",
  "career",
  "finance",
  "health",
  "education",
  "lifestyle",
] as const;

export type DecisionCategoryFilter =
  (typeof decisionCategoryFilterOptions)[number];

export const DEFAULT_DECISION_CATEGORY_FILTER: DecisionCategoryFilter = "all";

export const decisionCategoryFilterLabels: Record<
  DecisionCategoryFilter,
  string
> = {
  all: "All Categories",
  career: "Career",
  finance: "Finance",
  health: "Health",
  education: "Education",
  lifestyle: "Lifestyle",
};

export type DecisionListQuery = {
  sort: DecisionSortOption;
  status: DecisionStatusFilter;
  category: DecisionCategoryFilter;
};

export const DEFAULT_DECISION_LIST_QUERY: DecisionListQuery = {
  sort: DEFAULT_DECISION_SORT,
  status: DEFAULT_DECISION_STATUS_FILTER,
  category: DEFAULT_DECISION_CATEGORY_FILTER,
};

export function parseDecisionSortParam(
  value: string | undefined
): DecisionSortOption {
  if (
    value &&
    decisionSortOptions.includes(value as DecisionSortOption)
  ) {
    return value as DecisionSortOption;
  }

  return DEFAULT_DECISION_SORT;
}

export function parseDecisionStatusFilterParam(
  value: string | undefined
): DecisionStatusFilter {
  if (
    value &&
    decisionStatusFilterOptions.includes(value as DecisionStatusFilter)
  ) {
    return value as DecisionStatusFilter;
  }

  return DEFAULT_DECISION_STATUS_FILTER;
}

export function parseDecisionCategoryFilterParam(
  value: string | undefined
): DecisionCategoryFilter {
  if (
    value &&
    decisionCategoryFilterOptions.includes(value as DecisionCategoryFilter)
  ) {
    return value as DecisionCategoryFilter;
  }

  return DEFAULT_DECISION_CATEGORY_FILTER;
}

export function parseDecisionListQuery(searchParams: {
  sort?: string;
  status?: string;
  category?: string;
}): DecisionListQuery {
  return {
    sort: parseDecisionSortParam(searchParams.sort),
    status: parseDecisionStatusFilterParam(searchParams.status),
    category: parseDecisionCategoryFilterParam(searchParams.category),
  };
}

export function normalizeDecisionCategory(value: string) {
  return value.trim().toLowerCase();
}

export function matchesDecisionCategoryFilter(
  analysisCategory: string | null | undefined,
  filter: DecisionCategoryFilter
) {
  if (filter === "all") {
    return true;
  }

  if (!analysisCategory) {
    return false;
  }

  return normalizeDecisionCategory(analysisCategory) === filter;
}

export function statusFilterToDecisionStatus(
  filter: DecisionStatusFilter
): DecisionStatus | null {
  if (filter === "all") {
    return null;
  }

  return filter;
}

export function hasActiveDecisionListFilters(query: DecisionListQuery) {
  return (
    query.sort !== DEFAULT_DECISION_SORT ||
    query.status !== DEFAULT_DECISION_STATUS_FILTER ||
    query.category !== DEFAULT_DECISION_CATEGORY_FILTER
  );
}

export function decisionsListHref(options?: {
  page?: number;
  sort?: DecisionSortOption;
  status?: DecisionStatusFilter;
  category?: DecisionCategoryFilter;
}) {
  const params = new URLSearchParams();
  const sort = options?.sort ?? DEFAULT_DECISION_SORT;
  const status = options?.status ?? DEFAULT_DECISION_STATUS_FILTER;
  const category = options?.category ?? DEFAULT_DECISION_CATEGORY_FILTER;

  if (sort !== DEFAULT_DECISION_SORT) {
    params.set("sort", sort);
  }

  if (status !== DEFAULT_DECISION_STATUS_FILTER) {
    params.set("status", status);
  }

  if (category !== DEFAULT_DECISION_CATEGORY_FILTER) {
    params.set("category", category);
  }

  if (options?.page && options.page > 1) {
    params.set("page", String(options.page));
  }

  const query = params.toString();

  return query ? `${routes.decisions}?${query}` : routes.decisions;
}

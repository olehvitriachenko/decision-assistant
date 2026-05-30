"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
  DEFAULT_DECISION_BIAS_FILTER,
  DEFAULT_DECISION_CATEGORY_FILTER,
  DEFAULT_DECISION_SORT,
  DEFAULT_DECISION_STATUS_FILTER,
  decisionCategoryFilterLabels,
  type DecisionCategoryFilter,
  type DecisionListQuery,
  decisionSortLabels,
  decisionSortOptions,
  type DecisionSortOption,
  decisionStatusFilterLabels,
  decisionStatusFilterOptions,
  type DecisionStatusFilter,
  decisionsListHref,
  getBiasFilterLabel,
  hasActiveDecisionListFilters,
} from "@/lib/config/decision-list-params";
import { getCategoryFilterOptions } from "@/lib/categories/registry";
import { elevatedSurfaceClassName } from "@/lib/ui/surface-classes";
import { cn } from "@/lib/utils";
import type { DecisionBiasFilterOption } from "@/lib/db/decisions";
import { m } from "@/lib/i18n/uk";
import { useDecisionsNavigation } from "@/components/decisions/decisions-navigation-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function updateSearchParams(
  current: URLSearchParams,
  updates: Partial<DecisionListQuery>
) {
  const next = new URLSearchParams(current.toString());

  const sort = updates.sort ?? current.get("sort") ?? DEFAULT_DECISION_SORT;
  const status =
    updates.status ?? current.get("status") ?? DEFAULT_DECISION_STATUS_FILTER;
  const category =
    updates.category ??
    current.get("category") ??
    DEFAULT_DECISION_CATEGORY_FILTER;
  const bias = updates.bias ?? current.get("bias") ?? DEFAULT_DECISION_BIAS_FILTER;

  next.delete("page");

  if (sort === DEFAULT_DECISION_SORT) {
    next.delete("sort");
  } else {
    next.set("sort", sort);
  }

  if (status === DEFAULT_DECISION_STATUS_FILTER) {
    next.delete("status");
  } else {
    next.set("status", status);
  }

  if (category === DEFAULT_DECISION_CATEGORY_FILTER) {
    next.delete("category");
  } else {
    next.set("category", category);
  }

  if (bias === DEFAULT_DECISION_BIAS_FILTER) {
    next.delete("bias");
  } else {
    next.set("bias", bias);
  }

  return next;
}

export function DecisionsToolbar({
  query,
  biasOptions,
}: {
  query: DecisionListQuery;
  biasOptions: DecisionBiasFilterOption[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigate } = useDecisionsNavigation();
  const hasActiveFilters = hasActiveDecisionListFilters(query);
  const categoryFilterOptions = getCategoryFilterOptions();
  const selectedBiasIsAvailable =
    query.bias === DEFAULT_DECISION_BIAS_FILTER ||
    biasOptions.some((option) => option.key === query.bias);

  function applyFilters(updates: Partial<DecisionListQuery>) {
    const next = updateSearchParams(searchParams, updates);
    const queryString = next.toString();
    navigate(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <div className={cn("space-y-4 rounded-xl border p-4", elevatedSurfaceClassName)}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="decisions-sort">{m.decisions.toolbar.sortBy}</Label>
          <Select
            value={query.sort}
            onValueChange={(value) =>
              applyFilters({ sort: value as DecisionSortOption })
            }
          >
            <SelectTrigger id="decisions-sort" className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {decisionSortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {decisionSortLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="decisions-status">{m.decisions.toolbar.status}</Label>
          <Select
            value={query.status}
            onValueChange={(value) =>
              applyFilters({ status: value as DecisionStatusFilter })
            }
          >
            <SelectTrigger id="decisions-status" className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {decisionStatusFilterOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {decisionStatusFilterLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="decisions-category">{m.decisions.toolbar.category}</Label>
          <Select
            value={query.category}
            onValueChange={(value) =>
              applyFilters({ category: value as DecisionCategoryFilter })
            }
          >
            <SelectTrigger id="decisions-category" className="w-full">
              <SelectValue placeholder={decisionCategoryFilterLabels.all}>
                {decisionCategoryFilterLabels[query.category]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="min-w-[var(--radix-select-trigger-width)] sm:min-w-72">
              {categoryFilterOptions.map((option) => (
                <SelectItem
                  key={option.slug}
                  value={option.slug}
                  textValue={option.labelUk}
                  description={option.descriptionUk || undefined}
                >
                  {option.labelUk}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="decisions-bias">{m.decisions.toolbar.bias}</Label>
          <Select
            value={
              selectedBiasIsAvailable ? query.bias : DEFAULT_DECISION_BIAS_FILTER
            }
            onValueChange={(value) => applyFilters({ bias: value })}
          >
            <SelectTrigger id="decisions-bias" className="w-full">
              <SelectValue placeholder="Bias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_DECISION_BIAS_FILTER}>
                {m.decisions.toolbar.allBiases}
              </SelectItem>
              {biasOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {m.decisions.toolbar.activeFilters}
            </span>
            {query.sort !== DEFAULT_DECISION_SORT ? (
              <Badge variant="secondary">
                {m.decisions.toolbar.sortPrefix} {decisionSortLabels[query.sort]}
              </Badge>
            ) : null}
            {query.status !== DEFAULT_DECISION_STATUS_FILTER ? (
              <Badge variant="secondary">
                {m.decisions.toolbar.statusPrefix}{" "}
                {decisionStatusFilterLabels[query.status]}
              </Badge>
            ) : null}
            {query.category !== DEFAULT_DECISION_CATEGORY_FILTER ? (
              <Badge variant="secondary">
                {m.decisions.toolbar.categoryPrefix}{" "}
                {decisionCategoryFilterLabels[query.category]}
              </Badge>
            ) : null}
            {query.bias !== DEFAULT_DECISION_BIAS_FILTER ? (
              <Badge variant="secondary">
                {m.decisions.toolbar.biasPrefix}{" "}
                {getBiasFilterLabel(query.bias, biasOptions)}
              </Badge>
            ) : null}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            onClick={() => navigate(decisionsListHref())}
          >
            {m.decisions.toolbar.clearFilters}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

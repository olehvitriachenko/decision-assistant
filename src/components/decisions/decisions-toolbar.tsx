"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  DEFAULT_DECISION_CATEGORY_FILTER,
  DEFAULT_DECISION_SORT,
  DEFAULT_DECISION_STATUS_FILTER,
  decisionCategoryFilterLabels,
  decisionCategoryFilterOptions,
  type DecisionCategoryFilter,
  type DecisionListQuery,
  decisionSortLabels,
  decisionSortOptions,
  type DecisionSortOption,
  decisionStatusFilterLabels,
  decisionStatusFilterOptions,
  type DecisionStatusFilter,
  decisionsListHref,
  hasActiveDecisionListFilters,
} from "@/lib/config/decision-list-params";
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

  return next;
}

export function DecisionsToolbar({ query }: { query: DecisionListQuery }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasActiveFilters = hasActiveDecisionListFilters(query);

  function navigate(updates: Partial<DecisionListQuery>) {
    const next = updateSearchParams(searchParams, updates);
    const queryString = next.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="decisions-sort">Sort by</Label>
          <Select
            value={query.sort}
            onValueChange={(value) =>
              navigate({ sort: value as DecisionSortOption })
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
          <Label htmlFor="decisions-status">Status</Label>
          <Select
            value={query.status}
            onValueChange={(value) =>
              navigate({ status: value as DecisionStatusFilter })
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

        <div className="space-y-2 sm:col-span-2 xl:col-span-1">
          <Label htmlFor="decisions-category">Category</Label>
          <Select
            value={query.category}
            onValueChange={(value) =>
              navigate({ category: value as DecisionCategoryFilter })
            }
          >
            <SelectTrigger id="decisions-category" className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {decisionCategoryFilterOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {decisionCategoryFilterLabels[option]}
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
              Active filters
            </span>
            {query.sort !== DEFAULT_DECISION_SORT ? (
              <Badge variant="secondary">
                Sort: {decisionSortLabels[query.sort]}
              </Badge>
            ) : null}
            {query.status !== DEFAULT_DECISION_STATUS_FILTER ? (
              <Badge variant="secondary">
                Status: {decisionStatusFilterLabels[query.status]}
              </Badge>
            ) : null}
            {query.category !== DEFAULT_DECISION_CATEGORY_FILTER ? (
              <Badge variant="secondary">
                Category: {decisionCategoryFilterLabels[query.category]}
              </Badge>
            ) : null}
          </div>
          <Button asChild variant="outline" size="sm" className="w-full shrink-0 sm:w-auto">
            <Link href={decisionsListHref()}>Clear filters</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

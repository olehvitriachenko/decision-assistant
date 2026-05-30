"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  hasActiveDecisionListFilters,
  type DecisionListQuery,
} from "@/lib/config/decision-list-params";
import type {
  DecisionBiasFilterOption,
  DecisionSupportStats,
  PaginatedDecisions,
} from "@/lib/db/decisions";
import { formatDecisionCount } from "@/lib/i18n/format";
import { m } from "@/lib/i18n/uk";
import { cn } from "@/lib/utils";
import { DecisionsProcessingWatcher } from "@/components/decisions/decision-analysis-poller";
import { DecisionsList } from "@/components/decisions/decisions-list";
import { DecisionsNavigationContext } from "@/components/decisions/decisions-navigation-context";
import { DecisionsPagination } from "@/components/decisions/decisions-pagination";
import { DecisionsStats } from "@/components/decisions/decisions-stats";
import { DecisionsToolbar } from "@/components/decisions/decisions-toolbar";

export function DecisionsPageContent({
  result,
  stats,
  biasOptions,
  query,
}: {
  result: PaginatedDecisions;
  stats: DecisionSupportStats;
  biasOptions: DecisionBiasFilterOption[];
  query: DecisionListQuery;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [displayResult, setDisplayResult] = useState(result);

  useEffect(() => {
    setDisplayResult(result);
  }, [result]);

  function navigate(href: string, options?: { scrollToTop?: boolean }) {
    if (options?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  const processingDecisionIds = displayResult.decisions
    .filter((decision) => decision.status === "processing")
    .map((decision) => decision.id);

  return (
    <DecisionsNavigationContext value={{ navigate, isPending }}>
      <section className="space-y-6">
        <DecisionsStats stats={stats} />
        <DecisionsToolbar query={query} biasOptions={biasOptions} />

        <div
          className={cn(
            "space-y-6 transition-opacity duration-200",
            isPending && "pointer-events-none opacity-60"
          )}
          aria-busy={isPending}
        >
            <p className="text-sm text-muted-foreground">
              {m.decisions.totalLabel(formatDecisionCount(displayResult.total))}
            </p>
            <DecisionsProcessingWatcher decisionIds={processingDecisionIds} />
            <DecisionsList
              decisions={displayResult.decisions}
              hasActiveFilters={hasActiveDecisionListFilters(query)}
            />
            <DecisionsPagination
              page={displayResult.page}
              totalPages={displayResult.totalPages}
              total={displayResult.total}
              query={displayResult.query}
            />
        </div>
      </section>
    </DecisionsNavigationContext>
  );
}

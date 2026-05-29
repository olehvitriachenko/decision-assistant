import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  decisionsListHref,
  hasActiveDecisionListFilters,
  parseDecisionListQuery,
} from "@/lib/config/decision-list-params";
import { routes } from "@/lib/config/routes";
import {
  DECISIONS_PAGE_SIZE,
  getDecisionBiasFilterOptions,
  getDecisionSupportStats,
  getDecisionsByUserIdPaginated,
} from "@/lib/db/decisions";
import { formatDecisionCount } from "@/lib/i18n/format";
import { m } from "@/lib/i18n/uk";
import { getUser } from "@/lib/supabase/auth";
import { DecisionsProcessingWatcher } from "@/components/decisions/decision-analysis-poller";
import { DecisionsList } from "@/components/decisions/decisions-list";
import { DecisionsPagination } from "@/components/decisions/decisions-pagination";
import { DecisionsStats } from "@/components/decisions/decisions-stats";
import { DecisionsToolbar } from "@/components/decisions/decisions-toolbar";
import { PageContainer } from "@/components/layout/page-container";

function parsePageParam(value: string | undefined) {
  const page = Number(value ?? "1");

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

export default async function DecisionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    status?: string;
    category?: string;
    bias?: string;
  }>;
}) {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  const params = await searchParams;
  const page = parsePageParam(params.page);
  const query = parseDecisionListQuery(params);

  const [result, stats, biasOptions] = await Promise.all([
    getDecisionsByUserIdPaginated(
      user.id,
      page,
      DECISIONS_PAGE_SIZE,
      query
    ),
    getDecisionSupportStats(user.id),
    getDecisionBiasFilterOptions(user.id),
  ]);

  if (page > result.totalPages && result.total > 0) {
    redirect(
      decisionsListHref({
        sort: query.sort,
        status: query.status,
        category: query.category,
        bias: query.bias,
      })
    );
  }

  const processingDecisionIds = result.decisions
    .filter((decision) => decision.status === "processing")
    .map((decision) => decision.id);

  return (
    <PageContainer>
      <DecisionsProcessingWatcher decisionIds={processingDecisionIds} />
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          {m.decisions.allTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {m.decisions.totalLabel(formatDecisionCount(result.total))}
        </p>
      </div>

      <section className="space-y-6">
        <DecisionsStats stats={stats} />
        <Suspense fallback={null}>
          <DecisionsToolbar query={result.query} biasOptions={biasOptions} />
        </Suspense>
        <DecisionsList
          decisions={result.decisions}
          hasActiveFilters={hasActiveDecisionListFilters(query)}
        />
        <DecisionsPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          query={result.query}
        />
      </section>
    </PageContainer>
  );
}

import { redirect } from "next/navigation";

import { decisionsListHref, parseDecisionListQuery } from "@/lib/config/decision-list-params";
import { routes } from "@/lib/config/routes";
import {
  DECISIONS_PAGE_SIZE,
  getDecisionBiasFilterOptions,
  getDecisionSupportStats,
  getDecisionsByUserIdPaginated,
} from "@/lib/db/decisions";
import { m } from "@/lib/i18n/uk";
import { getUser } from "@/lib/supabase/auth";
import { DecisionsPageContent } from "@/components/decisions/decisions-page-content";
import { NewDecisionButton } from "@/components/decisions/new-decision-button";
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
    getDecisionsByUserIdPaginated(user.id, page, DECISIONS_PAGE_SIZE, query),
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

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {m.decisions.allTitle}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground text-pretty">
            {m.decisions.allDescription}
          </p>
        </div>
        <NewDecisionButton fullWidth className="shrink-0 md:hidden" />
      </div>

      <DecisionsPageContent
        result={result}
        stats={stats}
        biasOptions={biasOptions}
        query={query}
      />
    </PageContainer>
  );
}

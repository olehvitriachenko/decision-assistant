import Link from "next/link";
import { redirect } from "next/navigation";

import { routes } from "@/lib/config/routes";
import {
  DECISIONS_PAGE_SIZE,
  getDecisionsByUserIdPaginated,
} from "@/lib/db/decisions";
import { getUser } from "@/lib/supabase/auth";
import { DecisionsList } from "@/components/decisions/decisions-list";
import { DecisionsPagination } from "@/components/decisions/decisions-pagination";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

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
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  const params = await searchParams;
  const page = parsePageParam(params.page);

  const result = await getDecisionsByUserIdPaginated(
    user.id,
    page,
    DECISIONS_PAGE_SIZE
  );

  if (page > result.totalPages && result.total > 0) {
    redirect(routes.decisions);
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            All decisions
          </h1>
          <p className="text-sm text-muted-foreground">
            {result.total} {result.total === 1 ? "decision" : "decisions"}{" "}
            total
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link href={routes.dashboard}>Back to dashboard</Link>
        </Button>
      </div>

      <section className="space-y-6">
        <DecisionsList decisions={result.decisions} />
        <DecisionsPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
        />
      </section>
    </PageContainer>
  );
}

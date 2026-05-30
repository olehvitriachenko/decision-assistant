import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { routes } from "@/lib/config/routes";
import {
  getDecisionDashboardInsights,
  getDecisionsByUserIdPaginated,
} from "@/lib/db/decisions";
import { formatDecisionCount } from "@/lib/i18n/format";
import { m } from "@/lib/i18n/uk";
import { getUser } from "@/lib/supabase/auth";
import { AppPurposeIntro } from "@/components/layout/app-purpose-intro";
import { DashboardInsights } from "@/components/dashboard/dashboard-insights";
import { DecisionsProcessingWatcher } from "@/components/decisions/decision-analysis-poller";
import { DecisionsList } from "@/components/decisions/decisions-list";
import { EmptyStateCard } from "@/components/layout/empty-state-card";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

const DASHBOARD_PREVIEW_LIMIT = 3;

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  const [{ decisions, total }, insights] = await Promise.all([
    getDecisionsByUserIdPaginated(user.id, 1, DASHBOARD_PREVIEW_LIMIT),
    getDecisionDashboardInsights(user.id),
  ]);

  const showViewAll = total > DASHBOARD_PREVIEW_LIMIT;
  const isEmpty = total === 0;
  const processingDecisionIds = decisions
    .filter((decision) => decision.status === "processing")
    .map((decision) => decision.id);

  return (
    <PageContainer>
      <DecisionsProcessingWatcher decisionIds={processingDecisionIds} />
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              {m.dashboard.welcome}
            </h1>
            {user.email ? (
              <p className="text-xs text-muted-foreground">{user.email}</p>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDecisionCount(total)}
          </p>
        </div>

        <AppPurposeIntro showSteps={isEmpty} />
      </div>

      {isEmpty ? (
        <EmptyStateCard
          icon={Sparkles}
          title={m.dashboard.emptyTitle}
          description={m.dashboard.emptyDescription}
          action={{
            href: routes.decisionsNew,
            label: m.nav.newDecision,
            icon: Plus,
          }}
        />
      ) : (
        <>
          <DashboardInsights insights={insights} hasDecisions />

          <section className="space-y-4">
            <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              {m.dashboard.recentDecisions}
            </h2>
            <DecisionsList decisions={decisions} />
            {showViewAll ? (
              <div className="flex justify-center pt-2">
                <Button asChild variant="outline">
                  <Link href={routes.decisions}>{m.dashboard.viewAllDecisions}</Link>
                </Button>
              </div>
            ) : null}
          </section>
        </>
      )}
    </PageContainer>
  );
}

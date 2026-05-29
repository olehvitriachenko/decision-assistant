import Link from "next/link";
import { redirect } from "next/navigation";

import { routes } from "@/lib/config/routes";
import { signOut } from "@/lib/actions/auth";
import { getDecisionsByUserIdPaginated } from "@/lib/db/decisions";
import { getUser } from "@/lib/supabase/auth";
import { DecisionsProcessingWatcher } from "@/components/decisions/decision-analysis-poller";
import { DecisionsList } from "@/components/decisions/decisions-list";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const DASHBOARD_PREVIEW_LIMIT = 3;

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  const { decisions, total } = await getDecisionsByUserIdPaginated(
    user.id,
    1,
    DASHBOARD_PREVIEW_LIMIT
  );

  const showViewAll = total > DASHBOARD_PREVIEW_LIMIT;
  const processingDecisionIds = decisions
    .filter((decision) => decision.status === "processing")
    .map((decision) => decision.id);

  return (
    <PageContainer>
      <DecisionsProcessingWatcher decisionIds={processingDecisionIds} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">{user.email}</span>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "decision" : "decisions"}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Recent decisions
        </h2>
        <DecisionsList decisions={decisions} />
        {showViewAll ? (
          <div className="flex justify-center pt-2">
            <Button asChild variant="outline">
              <Link href={routes.decisions}>View all decisions</Link>
            </Button>
          </div>
        ) : null}
      </section>

      <Separator />

      <form action={signOut}>
        <Button type="submit" variant="ghost" size="sm">
          Log out
        </Button>
      </form>
    </PageContainer>
  );
}

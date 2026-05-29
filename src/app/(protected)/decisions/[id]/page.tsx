import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getAnalysisByDecisionId } from "@/lib/db/analyses";
import { getDecisionById } from "@/lib/db/decisions";
import { routes } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";
import { DecisionDetailView } from "@/components/decisions/decision-detail-view";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default async function DecisionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();

  if (!user) {
    redirect(routes.login);
  }

  const { id } = await params;
  const decision = await getDecisionById(id);

  if (!decision || decision.user_id !== user.id) {
    notFound();
  }

  const analysis = await getAnalysisByDecisionId(decision.id);

  return (
    <PageContainer>
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href={routes.dashboard}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to dashboard
        </Link>
      </Button>

      <DecisionDetailView decision={decision} analysis={analysis} />
    </PageContainer>
  );
}

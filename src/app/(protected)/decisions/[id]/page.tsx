import { notFound, redirect } from "next/navigation";

import { getAnalysisByDecisionId } from "@/lib/db/analyses";
import { getDecisionById } from "@/lib/db/decisions";
import { routes } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";
import { DecisionDetailView } from "@/components/decisions/decision-detail-view";
import { PageContainer } from "@/components/layout/page-container";

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
      <DecisionDetailView decision={decision} analysis={analysis} />
    </PageContainer>
  );
}

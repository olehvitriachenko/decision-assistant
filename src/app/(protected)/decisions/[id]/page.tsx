import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAnalysisByDecisionId } from "@/lib/db/analyses";
import { getDecisionById } from "@/lib/db/decisions";
import { routes } from "@/lib/config/routes";
import { getUser } from "@/lib/supabase/auth";
import { DecisionStatusBadge } from "@/components/decisions/decision-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

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
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="outline">
          <Link href={routes.dashboard}>Back to dashboard</Link>
        </Button>
        <DecisionStatusBadge status={decision.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{decision.title}</CardTitle>
          <CardDescription>
            Created {formatCreatedAt(decision.created_at)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Situation</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {decision.situation}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Decision</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {decision.decision}
            </p>
          </div>
          {decision.thoughts ? (
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Thoughts</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {decision.thoughts}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {decision.status === "processing" ? (
        <Card>
          <CardHeader>
            <CardTitle>Analysis in progress</CardTitle>
            <CardDescription>
              This decision is still being analyzed. Refresh the page in a
              moment.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {decision.status === "failed" && !analysis ? (
        <Card>
          <CardHeader>
            <CardTitle>Analysis unavailable</CardTitle>
            <CardDescription>
              The AI analysis could not be completed for this decision.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {analysis ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Analysis</CardTitle>
                <CardDescription>
                  Category:{" "}
                  <span className="font-medium text-foreground">
                    {analysis.category}
                  </span>
                </CardDescription>
              </div>
              <p className="text-sm font-medium">
                Confidence: {analysis.confidence}%
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Summary</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {analysis.summary}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Possible biases</h3>
              {analysis.biases.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {analysis.biases.map((bias) => (
                    <li key={bias}>{bias}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No notable biases identified.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Missed alternatives</h3>
              {analysis.alternatives.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {analysis.alternatives.map((alternative) => (
                    <li key={alternative}>{alternative}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No alternatives identified.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

import type { Analysis } from "@/lib/types/analysis";
import type { Decision } from "@/lib/types/decision";
import { formatDateTime } from "@/lib/i18n/format";
import { m } from "@/lib/i18n/uk";
import { DecisionDeleteButton } from "@/components/decisions/decision-delete-button";
import { DecisionsBackLink } from "@/components/decisions/decisions-back-link";
import { DecisionAnalysisCard } from "@/components/decisions/decision-analysis-card";
import {
  DecisionAnalysisPoller,
  DecisionProcessingCard,
} from "@/components/decisions/decision-analysis-poller";
import { DecisionStatusBadge } from "@/components/decisions/decision-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function DetailSection({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </h3>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

export function DecisionDetailView({
  decision,
  analysis,
}: {
  decision: Decision;
  analysis: Analysis | null;
}) {
  return (
    <div className="space-y-6">
      <DecisionsBackLink />
      <DecisionAnalysisPoller status={decision.status} decisionId={decision.id} />

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <DecisionStatusBadge status={decision.status} size="md" />
            <p className="text-sm text-muted-foreground">
              {m.common.createdAt(formatDateTime(decision.created_at))}
            </p>
          </div>
          <DecisionDeleteButton decisionId={decision.id} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {decision.title}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{m.decisions.detail.contextTitle}</CardTitle>
          <CardDescription>{m.decisions.detail.contextDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DetailSection
            label={m.decisions.detail.situation}
            content={decision.situation}
          />
          <Separator />
          <DetailSection
            label={m.decisions.detail.decision}
            content={decision.decision}
          />
          {decision.thoughts ? (
            <>
              <Separator />
              <DetailSection
                label={m.decisions.detail.thoughts}
                content={decision.thoughts}
              />
            </>
          ) : null}
        </CardContent>
      </Card>

      {decision.status === "processing" && !analysis ? <DecisionProcessingCard /> : null}

      {analysis || decision.status === "failed" ? (
        <DecisionAnalysisCard decision={decision} analysis={analysis} />
      ) : null}
    </div>
  );
}

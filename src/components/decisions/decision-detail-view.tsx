import type { Analysis } from "@/lib/types/analysis";
import type { Decision } from "@/lib/types/decision";
import { formatDateTime } from "@/lib/i18n/format";
import { m } from "@/lib/i18n/uk";
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
      <DecisionAnalysisPoller status={decision.status} decisionId={decision.id} />

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {decision.status === "completed" ? (
              <DecisionStatusBadge status={decision.status} />
            ) : null}
            <span className="text-sm text-muted-foreground">
              {m.common.createdAt(formatDateTime(decision.created_at))}
            </span>
          </div>
          {decision.status !== "completed" ? (
            <DecisionStatusBadge status={decision.status} size="md" />
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
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

      {decision.status === "processing" ? <DecisionProcessingCard /> : null}

      {decision.status !== "processing" && (analysis || decision.status === "failed") ? (
        <DecisionAnalysisCard decision={decision} analysis={analysis} />
      ) : null}
    </div>
  );
}

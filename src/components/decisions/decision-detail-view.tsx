import type { Analysis } from "@/lib/types/analysis";
import type { Decision } from "@/lib/types/decision";
import { DecisionAnalysisCard } from "@/components/decisions/decision-analysis-card";
import { DecisionStatusBadge } from "@/components/decisions/decision-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

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
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <DecisionStatusBadge status={decision.status} />
          <span className="text-sm text-muted-foreground">
            Created {formatCreatedAt(decision.created_at)}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          {decision.title}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decision context</CardTitle>
          <CardDescription>
            The situation and choice you submitted for analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DetailSection label="Situation" content={decision.situation} />
          <Separator />
          <DetailSection label="Decision" content={decision.decision} />
          {decision.thoughts ? (
            <>
              <Separator />
              <DetailSection label="Thoughts" content={decision.thoughts} />
            </>
          ) : null}
        </CardContent>
      </Card>

      {decision.status === "processing" ? (
        <Card className="border-dashed bg-muted/20">
          <CardHeader>
            <CardTitle className="text-base">Analysis in progress</CardTitle>
            <CardDescription>
              AI is reviewing your decision. Refresh the page in a moment.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {(analysis || decision.status === "failed") ? (
        <DecisionAnalysisCard decision={decision} analysis={analysis} />
      ) : null}
    </div>
  );
}

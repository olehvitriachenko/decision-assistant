import type { Analysis } from "@/lib/types/analysis";
import type { Decision } from "@/lib/types/decision";
import {
  CategoryBadge,
  ConfidenceBadge,
  DecisionStatusBadge,
} from "@/components/decisions/decision-badges";
import { Badge } from "@/components/ui/badge";
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

      {decision.status === "failed" && !analysis ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base">Analysis unavailable</CardTitle>
            <CardDescription>
              The AI analysis could not be completed for this decision.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {analysis ? (
        <Card>
          <CardHeader className="gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={analysis.category} />
              <ConfidenceBadge confidence={analysis.confidence} />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">AI Analysis</CardTitle>
              <CardDescription>
                Insights generated from your decision context.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Summary
              </h3>
              <p className="text-base leading-relaxed text-pretty">
                {analysis.summary}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Possible biases
              </h3>
              {analysis.biases.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.biases.map((bias) => (
                    <Badge key={bias} variant="secondary">
                      {bias}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No notable biases identified.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Missed alternatives
              </h3>
              {analysis.alternatives.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {analysis.alternatives.map((alternative) => (
                    <Card key={alternative} size="sm" className="bg-muted/20">
                      <CardHeader>
                        <CardDescription className="text-sm leading-relaxed text-foreground">
                          {alternative}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
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

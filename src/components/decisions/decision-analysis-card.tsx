"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { reanalyzeDecision } from "@/lib/actions/decisions";
import type { Analysis } from "@/lib/types/analysis";
import type { Decision } from "@/lib/types/decision";
import {
  CategoryBadge,
  SupportScoreBadge,
} from "@/components/decisions/decision-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AnalysisLoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-10 text-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="flex size-12 items-center justify-center rounded-full border border-border/60 bg-muted/20">
        <Loader2
          className="size-5 animate-spin text-foreground"
          aria-hidden="true"
        />
      </span>
      <div className="space-y-1">
        <p className="font-medium">Re-analyzing your decision</p>
        <p className="text-sm text-muted-foreground">
          This usually takes a few seconds. Please keep this tab open.
        </p>
      </div>
    </div>
  );
}

export function DecisionAnalysisCard({
  decision,
  analysis,
}: {
  decision: Decision;
  analysis: Analysis | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleReanalyze() {
    setError(null);

    startTransition(async () => {
      const result = await reanalyzeDecision(decision.id);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  if (isPending) {
    return (
      <Card>
        <CardContent>
          <AnalysisLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (decision.status === "failed" && !analysis) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base">Analysis unavailable</CardTitle>
          <CardDescription>
            The AI analysis could not be completed for this decision.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col items-stretch gap-3 border-t border-border/60">
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleReanalyze}
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Retry analysis
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={analysis.category} />
          <SupportScoreBadge confidence={analysis.confidence} />
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
      <CardFooter className="flex-col items-stretch gap-3 border-t border-border/60">
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleReanalyze}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Re-analyze
        </Button>
      </CardFooter>
    </Card>
  );
}

"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { reanalyzeDecision } from "@/lib/actions/decisions";
import { m } from "@/lib/i18n/uk";
import type { Analysis } from "@/lib/types/analysis";
import type { Decision } from "@/lib/types/decision";
import {
  CategoryBadge,
  SupportScoreBadge,
} from "@/components/decisions/decision-badges";
import { BiasInsightsList } from "@/components/decisions/bias-insights-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  if (decision.status === "failed" && !analysis) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base">
            {m.decisions.analysis.unavailableTitle}
          </CardTitle>
          <CardDescription>
            {m.decisions.analysis.unavailableDescription}
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
            disabled={isPending}
            onClick={handleReanalyze}
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            {isPending ? m.decisions.analysis.starting : m.decisions.analysis.retry}
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
          <CardTitle className="text-xl">{m.decisions.analysis.title}</CardTitle>
          <CardDescription>{m.decisions.analysis.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {m.decisions.analysis.summary}
          </h3>
          <p className="text-base leading-relaxed text-pretty">
            {analysis.summary}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {m.decisions.analysis.biases}
          </h3>
          {analysis.biases.length > 0 ? (
            <BiasInsightsList biases={analysis.biases} />
          ) : (
            <p className="text-sm text-muted-foreground">
              {m.decisions.analysis.noBiases}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {m.decisions.analysis.alternatives}
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
              {m.decisions.analysis.noAlternatives}
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
          disabled={isPending}
          onClick={handleReanalyze}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          {isPending ? m.decisions.analysis.starting : m.decisions.analysis.reanalyze}
        </Button>
      </CardFooter>
    </Card>
  );
}

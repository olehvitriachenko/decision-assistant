import Link from "next/link";
import { ArrowRight, Inbox, Plus } from "lucide-react";

import { decisionDetailPath, routes } from "@/lib/config/routes";
import type { DecisionListItem } from "@/lib/types/decision";
import {
  CategoryBadge,
  ConfidenceBadge,
  DecisionStatusBadge,
} from "@/components/decisions/decision-badges";
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

export function DecisionsList({
  decisions,
  hasActiveFilters = false,
}: {
  decisions: DecisionListItem[];
  hasActiveFilters?: boolean;
}) {
  if (decisions.length === 0) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="flex flex-col items-center px-6 py-14 text-center">
          <span className="flex size-12 items-center justify-center rounded-full border border-border/60 bg-background">
            <Inbox className="size-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <CardTitle className="mt-4">
            {hasActiveFilters ? "No matching decisions" : "No decisions yet"}
          </CardTitle>
          <CardDescription className="mt-2 max-w-sm text-balance">
            {hasActiveFilters
              ? "Try adjusting your sort or filter settings to see more results."
              : "Start your first decision analysis. AI will help you spot biases and alternatives you might have missed."}
          </CardDescription>
          {!hasActiveFilters ? (
            <Button asChild className="mt-6">
              <Link href={routes.decisionsNew}>
                <Plus className="size-4" aria-hidden="true" />
                New Decision
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {decisions.map((decision) => (
        <Link
          key={decision.id}
          href={decisionDetailPath(decision.id)}
          className="group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Card
            size="sm"
            className="transition-colors hover:border-foreground/20 hover:bg-muted/20"
          >
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="truncate text-base">
                    {decision.title}
                  </CardTitle>
                  <CardDescription>
                    Created {formatCreatedAt(decision.created_at)}
                  </CardDescription>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  {decision.analysis_category ? (
                    <CategoryBadge category={decision.analysis_category} />
                  ) : null}
                  {decision.analysis_confidence !== null ? (
                    <ConfidenceBadge confidence={decision.analysis_confidence} />
                  ) : null}
                  <DecisionStatusBadge status={decision.status} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                View details
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

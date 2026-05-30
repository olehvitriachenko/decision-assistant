import Link from "next/link";
import { ArrowRight, Inbox, Plus } from "lucide-react";

import { decisionDetailPath, routes } from "@/lib/config/routes";
import { formatDateTime } from "@/lib/i18n/format";
import { m } from "@/lib/i18n/uk";
import type { DecisionListItem } from "@/lib/types/decision";
import {
  CategoryBadge,
  DecisionStatusBadge,
  SupportScoreBadge,
} from "@/components/decisions/decision-badges";
import { EmptyStateCard } from "@/components/layout/empty-state-card";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DecisionsList({
  decisions,
  hasActiveFilters = false,
}: {
  decisions: DecisionListItem[];
  hasActiveFilters?: boolean;
}) {
  if (decisions.length === 0) {
    return (
      <EmptyStateCard
        icon={Inbox}
        title={
          hasActiveFilters
            ? m.decisions.list.emptyFilteredTitle
            : m.decisions.list.emptyTitle
        }
        description={
          hasActiveFilters
            ? m.decisions.list.emptyFilteredDescription
            : m.decisions.list.emptyDescription
        }
        action={
          hasActiveFilters
            ? undefined
            : {
                href: routes.decisionsNew,
                label: m.nav.newDecision,
                icon: Plus,
              }
        }
        variant="dashed"
        iconRounded="full"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {decisions.map((decision) => (
        <Link
          key={decision.id}
          href={decisionDetailPath(decision.id)}
          className="group block cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Card
            size="sm"
            className="border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-200 hover:border-foreground/20 hover:bg-muted/25 hover:shadow-sm active:scale-[0.998]"
          >
            <CardHeader className="gap-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                  {decision.analysis_category ? (
                    <CategoryBadge
                      category={decision.analysis_category}
                      size="md"
                      variant="prominent"
                    />
                  ) : null}
                  {decision.analysis_confidence !== null ? (
                    <SupportScoreBadge
                      confidence={decision.analysis_confidence}
                      size="md"
                    />
                  ) : null}
                </div>
                <div className="shrink-0">
                  <DecisionStatusBadge status={decision.status} size="md" />
                </div>
              </div>

              <CardTitle className="line-clamp-2 text-base leading-snug transition-colors group-hover:text-foreground">
                {decision.title}
              </CardTitle>

              <CardDescription className="line-clamp-2 text-sm leading-relaxed text-pretty">
                {decision.decision}
              </CardDescription>

              <p className="text-xs text-muted-foreground">
                {m.common.createdAt(formatDateTime(decision.created_at))}
              </p>

              <div className="hidden items-center gap-1 pt-0.5 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex">
                {m.decisions.list.viewDetails}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

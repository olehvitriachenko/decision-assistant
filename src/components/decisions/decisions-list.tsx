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

function DecisionListBadges({ decision }: { decision: DecisionListItem }) {
  const showStatus = decision.status !== "completed";
  const showCategory = Boolean(decision.analysis_category);
  const showSupport = decision.analysis_confidence !== null;

  if (!showStatus && !showCategory && !showSupport) {
    return null;
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
      {showStatus ? (
        <DecisionStatusBadge status={decision.status} size="md" />
      ) : null}
      {showCategory ? (
        <CategoryBadge category={decision.analysis_category!} size="md" />
      ) : null}
      {showSupport ? (
        <SupportScoreBadge
          confidence={decision.analysis_confidence!}
          size="md"
        />
      ) : null}
    </div>
  );
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
            <CardHeader className="gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <CardTitle className="line-clamp-2 text-base leading-snug transition-colors group-hover:text-foreground">
                    {decision.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>
                      {m.common.createdAt(formatDateTime(decision.created_at))}
                    </span>
                    {decision.status === "completed" ? (
                      <>
                        <span className="text-muted-foreground/40" aria-hidden="true">
                          ·
                        </span>
                        <DecisionStatusBadge status={decision.status} />
                      </>
                    ) : null}
                  </CardDescription>
                </div>
                <DecisionListBadges decision={decision} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
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

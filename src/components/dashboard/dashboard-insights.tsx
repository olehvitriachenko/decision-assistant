import { Brain, ShieldCheck, Sparkles, Tags } from "lucide-react";

import { getBiasDescriptionByKey } from "@/lib/bias-descriptions";
import type { DecisionDashboardInsights } from "@/lib/db/decisions";
import { formatAnalyzedDecisionCount } from "@/lib/i18n/format";
import { m } from "@/lib/i18n/uk";
import { elevatedSurfaceClassName, iconSurfaceClassName } from "@/lib/ui/surface-classes";
import { cn } from "@/lib/utils";
import { supportLevelLabels } from "@/lib/support-score";
import { FrequencyBarList, formatSupportDistributionValue } from "@/components/dashboard/frequency-bar-list";
import { EmptyStateCard } from "@/components/layout/empty-state-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const supportDistributionItems = [
  {
    key: "high" as const,
    label: supportLevelLabels.high,
    barClassName: "bg-emerald-500/70 dark:bg-emerald-400/70",
  },
  {
    key: "medium" as const,
    label: supportLevelLabels.medium,
    barClassName: "bg-amber-500/70 dark:bg-amber-400/70",
  },
  {
    key: "low" as const,
    label: supportLevelLabels.low,
    barClassName: "bg-destructive/70",
  },
];

export function DashboardInsights({
  insights,
  hasDecisions = true,
}: {
  insights: DecisionDashboardInsights;
  hasDecisions?: boolean;
}) {
  const hasData = insights.analyzedCount > 0;

  if (!hasData) {
    if (!hasDecisions) {
      return null;
    }

    return (
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {m.dashboard.insights}
          </h2>
        </div>

        <EmptyStateCard
          icon={Sparkles}
          title={m.dashboard.insightsPendingTitle}
          description={m.dashboard.insightsPendingDescription}
        />
      </section>
    );
  }

  const supportItems = supportDistributionItems.map((item) => ({
    label: item.label,
    count: insights.supportDistribution[item.key],
  }));

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {m.dashboard.insights}
        </h2>
        <p className="text-sm text-muted-foreground">
          {m.dashboard.insightsFrom(
            formatAnalyzedDecisionCount(insights.analyzedCount)
          )}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className={elevatedSurfaceClassName}>
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <span className={cn("flex size-8 items-center justify-center rounded-lg", iconSurfaceClassName)}>
                <Tags className="size-4 text-primary" aria-hidden="true" />
              </span>
              <div className="space-y-0.5">
                <CardTitle className="text-base">{m.dashboard.categoriesTitle}</CardTitle>
                <CardDescription>{m.dashboard.categoriesDescription}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FrequencyBarList
              items={insights.categories}
              emptyMessage={m.dashboard.noCategoryData}
              barClassName="bg-primary/70"
            />
          </CardContent>
        </Card>

        <Card className={elevatedSurfaceClassName}>
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <span className={cn("flex size-8 items-center justify-center rounded-lg", iconSurfaceClassName)}>
                <Brain className="size-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              </span>
              <div className="space-y-0.5">
                <CardTitle className="text-base">{m.dashboard.biasesTitle}</CardTitle>
                <CardDescription>{m.dashboard.biasesDescription}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FrequencyBarList
              items={insights.biases}
              emptyMessage={m.dashboard.noBiasData}
              barClassName="bg-amber-500/70 dark:bg-amber-400/70"
              getHint={(item) =>
                item.key
                  ? getBiasDescriptionByKey(item.key).description
                  : undefined
              }
            />
          </CardContent>
        </Card>

        <Card className={elevatedSurfaceClassName}>
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <span className={cn("flex size-8 items-center justify-center rounded-lg", iconSurfaceClassName)}>
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              </span>
              <div className="space-y-0.5">
                <CardTitle className="text-base">{m.dashboard.supportTitle}</CardTitle>
                <CardDescription>{m.dashboard.supportDescription}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FrequencyBarList
              items={supportItems}
              total={insights.analyzedCount}
              formatValue={formatSupportDistributionValue}
              emptyMessage={m.dashboard.noSupportData}
              getBarClassName={(item) =>
                supportDistributionItems.find((entry) => entry.label === item.label)
                  ?.barClassName ?? "bg-primary/70"
              }
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

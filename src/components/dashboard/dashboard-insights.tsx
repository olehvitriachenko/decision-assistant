import Link from "next/link";
import { Brain, ShieldCheck, Sparkles, Tags } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { getBiasDescription } from "@/lib/bias-descriptions";
import type { DecisionDashboardInsights } from "@/lib/db/decisions";
import { formatAnalyzedDecisionCount } from "@/lib/i18n/format";
import { m } from "@/lib/i18n/uk";
import { supportLevelLabels } from "@/lib/support-score";
import { FrequencyBarList, formatSupportDistributionValue } from "@/components/dashboard/frequency-bar-list";
import { Button } from "@/components/ui/button";
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
}: {
  insights: DecisionDashboardInsights;
}) {
  const hasData = insights.analyzedCount > 0;

  if (!hasData) {
    return (
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {m.dashboard.insights}
          </h2>
        </div>

        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-muted/30">
              <Sparkles className="size-5 text-muted-foreground" aria-hidden="true" />
            </span>
            <div className="space-y-2">
              <p className="text-base font-medium">
                {m.dashboard.insightsEmptyTitle}
              </p>
              <p className="max-w-md text-sm text-muted-foreground text-pretty">
                {m.dashboard.insightsEmptyDescription}
              </p>
            </div>
            <Button asChild>
              <Link href={routes.decisionsNew}>{m.nav.newDecision}</Link>
            </Button>
          </CardContent>
        </Card>
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
        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/70">
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

        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/70">
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
              getHint={(item) => getBiasDescription(item.label).description || undefined}
            />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/70">
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

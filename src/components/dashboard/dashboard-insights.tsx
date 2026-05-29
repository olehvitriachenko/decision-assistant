import Link from "next/link";
import { Brain, ShieldCheck, Sparkles, Tags } from "lucide-react";

import { routes } from "@/lib/config/routes";
import { getBiasDescription } from "@/lib/bias-descriptions";
import type { DecisionDashboardInsights } from "@/lib/db/decisions";
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
            Insights
          </h2>
        </div>

        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-muted/30">
              <Sparkles className="size-5 text-muted-foreground" aria-hidden="true" />
            </span>
            <div className="space-y-2">
              <p className="text-base font-medium">
                Create your first decision to unlock insights.
              </p>
              <p className="max-w-md text-sm text-muted-foreground text-pretty">
                Once your decision is analyzed, you&apos;ll see category trends,
                common biases, and support score distribution here.
              </p>
            </div>
            <Button asChild>
              <Link href={routes.decisionsNew}>New Decision</Link>
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
          Insights
        </h2>
        <p className="text-sm text-muted-foreground">
          Insights generated from {insights.analyzedCount} analyzed{" "}
          {insights.analyzedCount === 1 ? "decision" : "decisions"}.
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
                <CardTitle className="text-base">Decision categories</CardTitle>
                <CardDescription>
                  Most common types across your decisions.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FrequencyBarList
              items={insights.categories}
              emptyMessage="No category data yet."
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
                <CardTitle className="text-base">Common biases</CardTitle>
                <CardDescription>
                  Cognitive patterns that appear most often.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FrequencyBarList
              items={insights.biases}
              emptyMessage="No bias patterns detected yet."
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
                <CardTitle className="text-base">Support distribution</CardTitle>
                <CardDescription>
                  Distribution of support scores across your decisions.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FrequencyBarList
              items={supportItems}
              total={insights.analyzedCount}
              formatValue={formatSupportDistributionValue}
              emptyMessage="No support score data yet."
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

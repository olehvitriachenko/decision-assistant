import { BarChart3, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

import type { DecisionSupportStats } from "@/lib/db/decisions";
import { m } from "@/lib/i18n/uk";
import { elevatedSurfaceClassName, iconSurfaceClassName } from "@/lib/ui/surface-classes";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statCards = [
  {
    key: "total",
    label: m.decisions.stats.total,
    icon: BarChart3,
    accent: "from-primary/10 to-transparent",
    iconClass: "text-foreground",
    valueClass: "text-foreground",
  },
  {
    key: "highSupport",
    label: m.decisions.stats.highSupport,
    icon: ShieldCheck,
    accent: "from-emerald-500/10 to-transparent",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    valueClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "mediumSupport",
    label: m.decisions.stats.mediumSupport,
    icon: ShieldQuestion,
    accent: "from-amber-500/10 to-transparent",
    iconClass: "text-amber-600 dark:text-amber-400",
    valueClass: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "lowSupport",
    label: m.decisions.stats.lowSupport,
    icon: ShieldAlert,
    accent: "from-destructive/10 to-transparent",
    iconClass: "text-destructive",
    valueClass: "text-destructive",
  },
] as const;

export function DecisionsStats({ stats }: { stats: DecisionSupportStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];

        return (
          <Card
            key={card.key}
            className={cn("overflow-hidden", elevatedSurfaceClassName)}
          >
            <CardContent className="relative p-4">
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
                  card.accent
                )}
              />
              <div className="relative flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {card.label}
                  </p>
                  <p className={cn("text-3xl font-semibold tabular-nums", card.valueClass)}>
                    {value}
                  </p>
                </div>
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", iconSurfaceClassName)}>
                  <Icon className={cn("size-4", card.iconClass)} aria-hidden="true" />
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

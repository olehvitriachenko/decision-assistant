import { Loader2 } from "lucide-react";

import { formatCategoryDisplay } from "@/lib/i18n/format";
import { m } from "@/lib/i18n/uk";
import type { DecisionStatus } from "@/lib/types/decision";
import { classifySupportScore } from "@/lib/support-score";
import {
  categoryOutlineBadgeClassName,
  categoryProminentBadgeClassName,
} from "@/lib/ui/surface-classes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusLabels = m.status;

const statusBadgeClassNames: Record<DecisionStatus, string> = {
  processing:
    "border-amber-500/30 bg-amber-500/10 font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  failed:
    "border-destructive/30 bg-destructive/10 font-medium text-destructive dark:bg-destructive/20",
  completed:
    "border-border/70 bg-muted/50 font-medium text-foreground/75 dark:border-border/40 dark:bg-transparent dark:font-normal dark:text-muted-foreground",
};

const badgeAlignClass = "inline-flex items-center justify-center leading-none py-0";

export function DecisionStatusBadge({
  status,
  size = "sm",
}: {
  status: DecisionStatus;
  size?: "sm" | "md";
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        badgeAlignClass,
        size === "md" ? "h-6 px-2.5 text-xs" : "h-5 px-1.5 text-[0.65rem]",
        statusBadgeClassNames[status]
      )}
    >
      {status === "processing" ? (
        <Loader2
          className={cn("animate-spin", size === "md" ? "size-3.5" : "size-3")}
          aria-hidden="true"
        />
      ) : null}
      {statusLabels[status]}
    </Badge>
  );
}

export function CategoryBadge({
  category,
  size = "sm",
  variant = "default",
}: {
  category: string;
  size?: "sm" | "md";
  variant?: "default" | "prominent";
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        badgeAlignClass,
        size === "md" ? "h-6 px-2.5 text-xs" : "h-5",
        variant === "prominent"
          ? categoryProminentBadgeClassName
          : categoryOutlineBadgeClassName,
        variant === "prominent" && size === "md" && "h-7 px-3"
      )}
    >
      {formatCategoryDisplay(category)}
    </Badge>
  );
}

export function SupportScoreBadge({
  confidence,
  size = "sm",
}: {
  confidence: number;
  size?: "sm" | "md";
}) {
  const support = classifySupportScore(confidence);

  return (
    <Badge
      variant="outline"
      className={cn(
        badgeAlignClass,
        size === "md" ? "h-6 px-2.5 text-xs font-medium" : "h-5 font-medium",
        "border",
        support.className
      )}
    >
      {support.formatted}
    </Badge>
  );
}

/** @deprecated Use SupportScoreBadge */
export function ConfidenceBadge({ confidence }: { confidence: number }) {
  return <SupportScoreBadge confidence={confidence} />;
}

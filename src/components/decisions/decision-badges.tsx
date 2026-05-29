import type { DecisionStatus } from "@/lib/types/decision";
import { classifySupportScore } from "@/lib/support-score";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusLabels: Record<DecisionStatus, string> = {
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

export function DecisionStatusBadge({ status }: { status: DecisionStatus }) {
  return (
    <Badge
      variant="outline"
      className="border-border/40 bg-transparent px-1.5 text-[0.65rem] font-normal text-muted-foreground"
    >
      {statusLabels[status]}
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge
      variant="outline"
      className="border-border/60 bg-background/60 capitalize backdrop-blur-sm"
    >
      {category}
    </Badge>
  );
}

export function SupportScoreBadge({ confidence }: { confidence: number }) {
  const support = classifySupportScore(confidence);

  return (
    <Badge
      variant="outline"
      className={cn("border font-medium", support.className)}
    >
      {support.formatted}
    </Badge>
  );
}

/** @deprecated Use SupportScoreBadge */
export function ConfidenceBadge({ confidence }: { confidence: number }) {
  return <SupportScoreBadge confidence={confidence} />;
}

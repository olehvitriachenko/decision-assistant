import type { DecisionStatus } from "@/lib/types/decision";
import { Badge } from "@/components/ui/badge";

const statusLabels: Record<DecisionStatus, string> = {
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

const statusVariants: Record<
  DecisionStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  processing: "secondary",
  completed: "default",
  failed: "destructive",
};

export function DecisionStatusBadge({ status }: { status: DecisionStatus }) {
  return (
    <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="outline" className="capitalize">
      {category}
    </Badge>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const variant =
    confidence >= 70 ? "default" : confidence >= 40 ? "secondary" : "outline";

  return <Badge variant={variant}>{confidence}% confidence</Badge>;
}

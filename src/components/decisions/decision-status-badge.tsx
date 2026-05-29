import type { DecisionStatus } from "@/lib/types/decision";
import { Badge } from "@/components/ui/badge";

const statusLabels: Record<DecisionStatus, string> = {
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

const statusVariants: Record<
  DecisionStatus,
  "default" | "secondary" | "destructive"
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

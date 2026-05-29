import Link from "next/link";

import { decisionDetailPath } from "@/lib/config/routes";
import type { DecisionListItem } from "@/lib/types/decision";
import { DecisionStatusBadge } from "@/components/decisions/decision-status-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DecisionsList({ decisions }: { decisions: DecisionListItem[] }) {
  if (decisions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No decisions yet</CardTitle>
          <CardDescription>
            Create your first decision to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {decisions.map((decision) => (
        <Link
          key={decision.id}
          href={decisionDetailPath(decision.id)}
          className="block transition-opacity hover:opacity-80"
        >
          <Card size="sm">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base">{decision.title}</CardTitle>
                <DecisionStatusBadge status={decision.status} />
              </div>
              <CardDescription>
                Created {formatCreatedAt(decision.created_at)}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

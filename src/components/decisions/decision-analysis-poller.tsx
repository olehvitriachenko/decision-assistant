"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { resumePendingAnalysis } from "@/lib/actions/decisions";
import { m } from "@/lib/i18n/uk";
import {
  dashedSurfaceClassName,
  iconSurfaceClassName,
} from "@/lib/ui/surface-classes";
import { cn } from "@/lib/utils";
import type { DecisionStatus } from "@/lib/types/decision";

const REFRESH_INTERVAL_MS = 2500;
const RECOVERY_INTERVAL_MS = 60_000;

function useProcessingRecovery(decisionIds: string[]) {
  const decisionIdsKey = decisionIds.join(",");

  useEffect(() => {
    if (decisionIds.length === 0) {
      return;
    }

    let cancelled = false;

    async function recover() {
      for (const decisionId of decisionIds) {
        if (cancelled) {
          return;
        }

        await resumePendingAnalysis(decisionId);
      }
    }

    void recover();

    const interval = window.setInterval(() => {
      void recover();
    }, RECOVERY_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [decisionIds, decisionIdsKey]);
}

export function DecisionsProcessingWatcher({
  decisionIds,
}: {
  decisionIds: string[];
}) {
  useProcessingRecovery(decisionIds);

  return <PageRefreshPoller enabled={decisionIds.length > 0} />;
}

export function PageRefreshPoller({ enabled }: { enabled: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const interval = window.setInterval(() => {
      router.refresh();
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [enabled, router]);

  return null;
}

export function DecisionAnalysisPoller({
  status,
  decisionId,
}: {
  status: DecisionStatus;
  decisionId?: string;
}) {
  useProcessingRecovery(
    status === "processing" && decisionId ? [decisionId] : []
  );

  return <PageRefreshPoller enabled={status === "processing"} />;
}

export function DecisionProcessingCard() {
  return (
    <div className={cn("rounded-xl p-6", dashedSurfaceClassName)}>
      <div
        className="flex flex-col items-center justify-center gap-4 py-6 text-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className={cn("flex size-12 items-center justify-center rounded-full", iconSurfaceClassName)}>
          <Loader2
            className="size-5 animate-spin text-foreground"
            aria-hidden="true"
          />
        </span>
        <div className="space-y-1">
          <p className="font-medium">{m.decisions.analysis.inProgressTitle}</p>
          <p className="max-w-sm text-sm text-muted-foreground text-balance">
            {m.decisions.analysis.inProgressDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { resumePendingAnalysis } from "@/lib/actions/decisions";
import type { DecisionStatus } from "@/lib/types/decision";

const POLL_INTERVAL_MS = 2500;

export function DecisionsProcessingWatcher({
  decisionIds,
}: {
  decisionIds: string[];
}) {
  const resumedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const decisionId of decisionIds) {
      if (resumedIds.current.has(decisionId)) {
        continue;
      }

      resumedIds.current.add(decisionId);
      void resumePendingAnalysis(decisionId);
    }
  }, [decisionIds]);

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
    }, POLL_INTERVAL_MS);

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
  const resumeAttempted = useRef(false);

  useEffect(() => {
    if (
      status !== "processing" ||
      !decisionId ||
      resumeAttempted.current
    ) {
      return;
    }

    resumeAttempted.current = true;
    void resumePendingAnalysis(decisionId);
  }, [status, decisionId]);

  return <PageRefreshPoller enabled={status === "processing"} />;
}

export function DecisionProcessingCard() {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6">
      <div
        className="flex flex-col items-center justify-center gap-4 py-6 text-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="flex size-12 items-center justify-center rounded-full border border-border/60 bg-background/80 backdrop-blur-sm">
          <Loader2
            className="size-5 animate-spin text-foreground"
            aria-hidden="true"
          />
        </span>
        <div className="space-y-1">
          <p className="font-medium">Analysis in progress</p>
          <p className="max-w-sm text-sm text-muted-foreground text-balance">
            AI is reviewing your decision. This page will update automatically
            when the analysis is ready.
          </p>
        </div>
      </div>
    </div>
  );
}

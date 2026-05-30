"use client";

import Link from "next/link";
import { useEffect } from "react";

import { routes } from "@/lib/config/routes";
import { m } from "@/lib/i18n/uk";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export function RouteError({
  error,
  reset,
  title = m.errors.genericTitle,
  description = m.errors.genericDescription,
  secondaryAction = {
    href: routes.dashboard,
    label: m.common.goToDashboard,
  },
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  secondaryAction?: {
    href: string;
    label: string;
  };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer className="max-w-lg justify-center py-16">
      <div className="mx-auto space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground text-pretty">{description}</p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            {m.common.tryAgain}
          </Button>
          <Button asChild variant="outline">
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";

import { routes } from "@/lib/config/routes";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export function RouteError({
  error,
  reset,
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this page.",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
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
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href={routes.dashboard}>Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

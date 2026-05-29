"use client";

import { RouteError } from "@/components/layout/route-error";
import { m } from "@/lib/i18n/uk";

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title={m.errors.protectedTitle}
      description={m.errors.protectedDescription}
    />
  );
}

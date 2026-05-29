"use client";

import { RouteError } from "@/components/layout/route-error";

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
      title="Unable to load this page"
      description="Something went wrong while fetching your data. Try again or return to the dashboard."
    />
  );
}

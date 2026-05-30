"use client";

import {
  publicNotFoundAction,
} from "@/components/layout/not-found-view";
import { RouteError } from "@/components/layout/route-error";
import { m } from "@/lib/i18n/uk";

export default function AuthError({
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
      title={m.errors.authTitle}
      description={m.errors.authDescription}
      secondaryAction={publicNotFoundAction}
    />
  );
}

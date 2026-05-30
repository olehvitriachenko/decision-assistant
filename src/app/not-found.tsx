import type { Metadata } from "next";

import {
  NotFoundView,
  authenticatedNotFoundAction,
  publicNotFoundAction,
} from "@/components/layout/not-found-view";
import { m } from "@/lib/i18n/uk";
import { getUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: m.errors.notFoundTitle,
};

export default async function NotFound() {
  const user = await getUser();

  return (
    <NotFoundView
      action={user ? authenticatedNotFoundAction : publicNotFoundAction}
    />
  );
}

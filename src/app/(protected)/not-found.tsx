import {
  NotFoundView,
  authenticatedNotFoundAction,
} from "@/components/layout/not-found-view";
import { m } from "@/lib/i18n/uk";

export default function ProtectedNotFound() {
  return (
    <NotFoundView
      description={m.errors.protectedNotFoundDescription}
      action={authenticatedNotFoundAction}
    />
  );
}

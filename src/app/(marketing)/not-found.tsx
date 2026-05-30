import {
  NotFoundView,
  publicNotFoundAction,
} from "@/components/layout/not-found-view";

export default function MarketingNotFound() {
  return <NotFoundView action={publicNotFoundAction} />;
}

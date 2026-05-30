import {
  NotFoundView,
  publicNotFoundAction,
} from "@/components/layout/not-found-view";

export default function AuthNotFound() {
  return <NotFoundView action={publicNotFoundAction} />;
}

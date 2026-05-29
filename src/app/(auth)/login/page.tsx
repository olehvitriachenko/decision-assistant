import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const callbackError =
    params.error === "confirmation_failed"
      ? "Email confirmation failed. Try signing in or register again."
      : undefined;

  return <LoginForm callbackError={callbackError} />;
}

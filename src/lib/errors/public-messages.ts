import { m } from "@/lib/i18n/uk";

type AuthLikeError = {
  message: string;
  code?: string;
};

export function logServerError(context: string, error: unknown) {
  console.error(context, error);
}

export function getAuthActionErrorMessage(error: AuthLikeError): string {
  const message = error.message.toLowerCase();
  const code = error.code?.toLowerCase();

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid email or password")
  ) {
    return m.auth.errors.invalidCredentials;
  }

  if (
    code === "user_already_exists" ||
    message.includes("already registered") ||
    message.includes("already been registered")
  ) {
    return m.auth.errors.emailTaken;
  }

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return m.auth.errors.emailNotConfirmed;
  }

  if (message.includes("too many requests") || code === "over_request_rate_limit") {
    return m.auth.errors.tooManyRequests;
  }

  return m.auth.errors.generic;
}

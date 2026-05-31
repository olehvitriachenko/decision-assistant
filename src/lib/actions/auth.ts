"use server";

import { redirect } from "next/navigation";

import { routes } from "@/lib/config/routes";
import {
  getAuthActionErrorMessage,
  logServerError,
} from "@/lib/errors/public-messages";
import { m } from "@/lib/i18n/uk";
import { createClient } from "@/lib/supabase/server";
import { authCredentialsSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

function parseCredentials(formData: FormData) {
  return authCredentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

export async function signInWithPassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = parseCredentials(formData);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    logServerError("Sign in failed", error);
    return { error: getAuthActionErrorMessage(error) };
  }

  redirect(routes.dashboard);
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = parseCredentials(formData);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    logServerError("Sign up failed", error);
    return { error: getAuthActionErrorMessage(error) };
  }

  if (!data.session) {
    return {
      error: m.auth.signUpNoSession,
    };
  }

  redirect(routes.dashboard);
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    logServerError("Sign out failed", error);
    redirect(routes.login);
  }

  redirect(routes.login);
}

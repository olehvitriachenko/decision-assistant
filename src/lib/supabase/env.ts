function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseEnv() {
  return {
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    key: requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  };
}

export function getSupabaseSecretKey() {
  return requireEnv("SUPABASE_SECRET_KEY");
}

export function getSupabaseProjectRef() {
  const fromEnv = process.env.SUPABASE_PROJECT_REF?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  const { url } = getSupabaseEnv();
  const match = url.match(/^https:\/\/([^.]+)\.supabase\.co\/?$/);

  if (!match) {
    throw new Error(
      "Could not derive project ref from NEXT_PUBLIC_SUPABASE_URL. Set SUPABASE_PROJECT_REF."
    );
  }

  return match[1];
}

import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv, getSupabaseSecretKey } from "@/lib/supabase/env";

export function createAdminClient() {
  const { url } = getSupabaseEnv();

  return createClient(url, getSupabaseSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

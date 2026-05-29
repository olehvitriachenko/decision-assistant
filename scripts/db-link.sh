#!/usr/bin/env sh
set -eu

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

ref="${SUPABASE_PROJECT_REF:-}"

if [ -z "$ref" ] && [ -n "${NEXT_PUBLIC_SUPABASE_URL:-}" ]; then
  ref=$(printf '%s' "$NEXT_PUBLIC_SUPABASE_URL" | sed -n 's|^https://\([^.]*\)\.supabase\.co/*$|\1|p')
fi

if [ -z "$ref" ]; then
  echo "Missing Supabase project ref."
  echo "Set SUPABASE_PROJECT_REF or NEXT_PUBLIC_SUPABASE_URL in .env"
  exit 1
fi

npx supabase link --project-ref "$ref"

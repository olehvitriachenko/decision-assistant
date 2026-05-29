#!/usr/bin/env sh
set -eu

if [ ! -f "supabase/.temp/project-ref" ]; then
  echo "Project is not linked yet."
  echo "Run once:"
  echo "  npx supabase login"
  echo "  npm run db:link"
  exit 1
fi

npx supabase db push "$@"

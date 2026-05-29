create type public.decision_status as enum ('processing', 'completed', 'failed');

create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  situation text not null,
  decision text not null,
  thoughts text,
  status public.decision_status not null default 'processing',
  created_at timestamptz not null default now()
);

create index decisions_user_id_created_at_idx
  on public.decisions (user_id, created_at desc);

alter table public.decisions enable row level security;

create policy "Users can view own decisions"
  on public.decisions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own decisions"
  on public.decisions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

grant usage on schema public to authenticated, service_role;

grant usage on type public.decision_status to authenticated, service_role;

grant select, insert on table public.decisions to authenticated;

grant all on table public.decisions to service_role;

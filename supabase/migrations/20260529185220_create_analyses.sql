create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null references public.decisions (id) on delete cascade,
  category text not null,
  confidence integer not null check (confidence >= 0 and confidence <= 100),
  biases jsonb not null default '[]',
  alternatives jsonb not null default '[]',
  summary text not null,
  created_at timestamptz not null default now()
);

create index analyses_decision_id_idx
  on public.analyses (decision_id);

create index analyses_decision_id_created_at_idx
  on public.analyses (decision_id, created_at desc);

alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses
  for select
  to authenticated
  using (
    exists (
      select 1
        from public.decisions
       where decisions.id = analyses.decision_id
         and decisions.user_id = auth.uid()
    )
  );

create policy "Users can insert own analyses"
  on public.analyses
  for insert
  to authenticated
  with check (
    exists (
      select 1
        from public.decisions
       where decisions.id = analyses.decision_id
         and decisions.user_id = auth.uid()
    )
  );

grant select, insert on table public.analyses to authenticated;

grant all on table public.analyses to service_role;

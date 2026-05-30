alter table public.decisions
  add column if not exists updated_at timestamptz not null default now();

update public.decisions
   set updated_at = created_at
 where updated_at is distinct from created_at;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists decisions_set_updated_at on public.decisions;

create trigger decisions_set_updated_at
  before update on public.decisions
  for each row
  execute function public.set_updated_at();

alter table public.decisions
  drop constraint if exists decisions_title_length,
  drop constraint if exists decisions_situation_length,
  drop constraint if exists decisions_decision_length,
  drop constraint if exists decisions_thoughts_length;

alter table public.decisions
  add constraint decisions_title_length check (char_length(title) between 1 and 200),
  add constraint decisions_situation_length check (char_length(situation) between 1 and 5000),
  add constraint decisions_decision_length check (char_length(decision) between 1 and 5000),
  add constraint decisions_thoughts_length check (
    thoughts is null or char_length(thoughts) <= 5000
  );

alter table public.analyses
  drop constraint if exists analyses_category_length,
  drop constraint if exists analyses_summary_length;

alter table public.analyses
  add constraint analyses_category_length check (char_length(category) between 1 and 100),
  add constraint analyses_summary_length check (char_length(summary) between 1 and 20000);

drop index if exists public.analyses_decision_id_idx;

create index if not exists decisions_user_id_status_created_at_idx
  on public.decisions (user_id, status, created_at desc);

drop policy if exists "Users can update own decisions" on public.decisions;

create policy "Users can delete own decisions"
  on public.decisions
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own analyses" on public.analyses;
drop policy if exists "Users can delete own analyses" on public.analyses;

revoke update on table public.decisions from authenticated;
revoke insert, delete on table public.analyses from authenticated;

grant delete on table public.decisions to authenticated;

-- Atomic analysis claim: one worker per decision, generation invalidates stale workers.

alter table public.decisions
  add column if not exists analysis_locked_at timestamptz,
  add column if not exists analysis_generation bigint not null default 0;

create or replace function public.claim_decision_analysis_lock(
  p_decision_id uuid,
  p_lock_stale_seconds integer default 900
)
returns table (
  claimed boolean,
  generation bigint
)
language plpgsql
volatile
set search_path = public
as $$
declare
  v_generation bigint;
begin
  update public.decisions d
  set analysis_locked_at = now()
  where d.id = p_decision_id
    and d.status = 'processing'
    and (
      d.analysis_locked_at is null
      or d.analysis_locked_at < now() - make_interval(secs => p_lock_stale_seconds)
    )
    and not exists (
      select 1
        from public.analyses a
       where a.decision_id = d.id
    )
  returning d.analysis_generation into v_generation;

  if found then
    claimed := true;
    generation := v_generation;
    return next;
    return;
  end if;

  select d.analysis_generation
    into v_generation
    from public.decisions d
   where d.id = p_decision_id;

  claimed := false;
  generation := coalesce(v_generation, 0);
  return next;
end;
$$;

create or replace function public.release_decision_analysis_lock(
  p_decision_id uuid
)
returns void
language sql
volatile
set search_path = public
as $$
  update public.decisions
     set analysis_locked_at = null
   where id = p_decision_id;
$$;

create or replace function public.bump_decision_analysis_generation(
  p_decision_id uuid
)
returns bigint
language sql
volatile
set search_path = public
as $$
  update public.decisions
     set analysis_generation = analysis_generation + 1,
         analysis_locked_at = null
   where id = p_decision_id
  returning analysis_generation;
$$;

revoke all on function public.claim_decision_analysis_lock(uuid, integer) from public;
revoke all on function public.release_decision_analysis_lock(uuid) from public;
revoke all on function public.bump_decision_analysis_generation(uuid) from public;

grant execute on function public.claim_decision_analysis_lock(uuid, integer) to service_role;
grant execute on function public.release_decision_analysis_lock(uuid) to service_role;
grant execute on function public.bump_decision_analysis_generation(uuid) to service_role;

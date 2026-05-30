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

revoke all on function public.claim_decision_analysis_lock(uuid, integer) from public;
revoke all on function public.release_decision_analysis_lock(uuid) from public;

grant execute on function public.claim_decision_analysis_lock(uuid, integer) to service_role;
grant execute on function public.release_decision_analysis_lock(uuid) to service_role;

-- One analysis per decision; atomic re-analyze reset.

delete from public.analyses a
 using public.analyses b
 where a.decision_id = b.decision_id
   and a.created_at < b.created_at;

alter table public.analyses
  drop constraint if exists analyses_decision_id_unique;

alter table public.analyses
  add constraint analyses_decision_id_unique unique (decision_id);

create or replace function public.reset_decision_analysis(
  p_decision_id uuid
)
returns bigint
language plpgsql
volatile
set search_path = public
as $$
declare
  v_generation bigint;
begin
  delete from public.analyses
   where decision_id = p_decision_id;

  update public.decisions
     set analysis_generation = analysis_generation + 1,
         analysis_locked_at = null,
         status = 'processing'
   where id = p_decision_id
  returning analysis_generation into v_generation;

  if not found then
    raise exception 'Decision not found: %', p_decision_id;
  end if;

  return v_generation;
end;
$$;

revoke all on function public.reset_decision_analysis(uuid) from public;

grant execute on function public.reset_decision_analysis(uuid) to service_role;

-- reset_decision_analysis supersedes the earlier bump-only helper.
drop function if exists public.bump_decision_analysis_generation(uuid);

-- Atomically verify analysis generation and insert in one transaction.

create or replace function public.insert_decision_analysis_if_generation_matches(
  p_decision_id uuid,
  p_expected_generation bigint,
  p_category text,
  p_confidence integer,
  p_biases jsonb,
  p_alternatives jsonb,
  p_summary text
)
returns uuid
language plpgsql
volatile
set search_path = public
as $$
declare
  v_analysis_id uuid;
begin
  perform 1
    from public.decisions d
   where d.id = p_decision_id
     for update;

  if not exists (
    select 1
      from public.decisions d
     where d.id = p_decision_id
       and d.status = 'processing'
       and d.analysis_generation = p_expected_generation
  ) then
    return null;
  end if;

  insert into public.analyses (
    decision_id,
    category,
    confidence,
    biases,
    alternatives,
    summary
  ) values (
    p_decision_id,
    p_category,
    p_confidence,
    p_biases,
    p_alternatives,
    p_summary
  )
  on conflict (decision_id) do nothing
  returning id into v_analysis_id;

  return v_analysis_id;
end;
$$;

revoke all on function public.insert_decision_analysis_if_generation_matches(
  uuid,
  bigint,
  text,
  integer,
  jsonb,
  jsonb,
  text
) from public;

grant execute on function public.insert_decision_analysis_if_generation_matches(
  uuid,
  bigint,
  text,
  integer,
  jsonb,
  jsonb,
  text
) to service_role;

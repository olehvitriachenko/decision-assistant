-- Paginated decision list with latest analysis filters/sorts in SQL.

create or replace function public.list_decisions_paginated(
  p_page integer default 1,
  p_page_size integer default 10,
  p_sort text default 'newest',
  p_status text default 'all',
  p_category text default 'all',
  p_bias text default 'all'
)
returns table (
  id uuid,
  title text,
  decision text,
  status public.decision_status,
  created_at timestamptz,
  analysis_category text,
  analysis_confidence integer,
  analysis_bias_count integer,
  total_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  with latest_analyses as (
    select distinct on (a.decision_id)
      a.decision_id,
      a.category,
      a.confidence,
      a.biases
    from public.analyses a
    order by a.decision_id, a.created_at desc
  ),
  filtered as (
    select
      d.id,
      d.title,
      d.decision,
      d.status,
      d.created_at,
      la.category as analysis_category,
      la.confidence as analysis_confidence,
      case
        when la.biases is null then null
        else jsonb_array_length(la.biases)
      end as analysis_bias_count,
      case
        when la.confidence is null and la.biases is null then null
        else (
          case when la.confidence is null then 50 else 100 - la.confidence end
        ) + coalesce(jsonb_array_length(la.biases), 0) * 12
      end as complexity_score
    from public.decisions d
    left join latest_analyses la on la.decision_id = d.id
    where d.user_id = auth.uid()
      and (p_status = 'all' or d.status::text = p_status)
      and (
        p_category = 'all'
        or (
          la.category is not null
          and lower(replace(la.category, ' ', '-')) = p_category
        )
      )
      and (
        p_bias = 'all'
        or exists (
          select 1
          from jsonb_array_elements_text(coalesce(la.biases, '[]'::jsonb)) as bias(value)
          where lower(bias.value) = lower(p_bias)
        )
      )
  )
  select
    f.id,
    f.title,
    f.decision,
    f.status,
    f.created_at,
    f.analysis_category,
    f.analysis_confidence,
    f.analysis_bias_count,
    count(*) over () as total_count
  from filtered f
  order by
    case when p_sort = 'oldest' then f.created_at end asc nulls last,
    case when p_sort = 'newest' then f.created_at end desc nulls last,
    case when p_sort = 'title_asc' then f.title end asc nulls last,
    case when p_sort = 'title_desc' then f.title end desc nulls last,
    case when p_sort = 'confidence_high' then f.analysis_confidence end desc nulls last,
    case when p_sort = 'confidence_low' then f.analysis_confidence end asc nulls last,
    case when p_sort = 'complexity_high' then f.complexity_score end desc nulls last,
    case when p_sort = 'complexity_low' then f.complexity_score end asc nulls last,
    f.created_at desc
  limit greatest(p_page_size, 1)
  offset greatest(p_page - 1, 0) * greatest(p_page_size, 1);
$$;

create or replace function public.get_decision_support_stats()
returns table (
  total bigint,
  high_support bigint,
  medium_support bigint,
  low_support bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  with latest_analyses as (
    select distinct on (a.decision_id)
      a.decision_id,
      a.confidence
    from public.analyses a
    order by a.decision_id, a.created_at desc
  ),
  scoped as (
    select
      d.id,
      la.confidence
    from public.decisions d
    left join latest_analyses la on la.decision_id = d.id
    where d.user_id = auth.uid()
  )
  select
    count(*)::bigint as total,
    count(*) filter (where confidence >= 70)::bigint as high_support,
    count(*) filter (where confidence >= 40 and confidence < 70)::bigint as medium_support,
    count(*) filter (where confidence < 40)::bigint as low_support
  from scoped;
$$;

create or replace function public.get_decision_bias_filter_options()
returns table (
  bias_key text,
  bias_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  with latest_analyses as (
    select distinct on (a.decision_id)
      a.decision_id,
      a.biases
    from public.analyses a
    order by a.decision_id, a.created_at desc
  ),
  scoped as (
    select la.biases
    from public.decisions d
    join latest_analyses la on la.decision_id = d.id
    where d.user_id = auth.uid()
  ),
  expanded as (
    select lower(bias.value) as bias_key
    from scoped
    cross join lateral jsonb_array_elements_text(coalesce(scoped.biases, '[]'::jsonb)) as bias(value)
  )
  select
    expanded.bias_key,
    count(*)::bigint as bias_count
  from expanded
  group by expanded.bias_key
  order by bias_count desc, expanded.bias_key asc;
$$;

grant execute on function public.list_decisions_paginated(
  integer,
  integer,
  text,
  text,
  text,
  text
) to authenticated;

grant execute on function public.get_decision_support_stats() to authenticated;

grant execute on function public.get_decision_bias_filter_options() to authenticated;

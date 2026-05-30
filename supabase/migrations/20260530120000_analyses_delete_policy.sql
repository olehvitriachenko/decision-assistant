create policy "Users can delete own analyses"
  on public.analyses
  for delete
  to authenticated
  using (
    exists (
      select 1
        from public.decisions
       where decisions.id = analyses.decision_id
         and decisions.user_id = auth.uid()
    )
  );

grant delete on table public.analyses to authenticated;

-- =========================================
-- Fase 3: pg_cron voor automatisch verlopen van open slots.
-- Elke minuut: zet 'open'-slots met start_tijd <= now() op 'voorbij'.
-- Geclaimde slots behouden hun status zodat de zaak nog
-- gekomen/niet_gekomen kan markeren voor de factuur.
-- =========================================

create extension if not exists pg_cron with schema extensions;

-- Idempotent re-schedule
do $$
begin
  if exists (select 1 from cron.job where jobname = 'expire-open-slots') then
    perform cron.unschedule('expire-open-slots');
  end if;
end
$$;

select cron.schedule(
  'expire-open-slots',
  '* * * * *',
  $$
    update public.slots
      set status = 'voorbij'
      where status = 'open'
        and start_tijd <= now()
  $$
);

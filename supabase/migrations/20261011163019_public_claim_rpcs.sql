-- =========================================
-- Fase 2: publieke RPCs voor de bevestigingspagina.
--
-- Een claim-id is een UUID die aan de klant getoond wordt in de
-- bevestigingsmail en URL. Anonymous roles mogen via deze functies
-- hun eigen claim-summary ophalen en annuleren. Customer PII wordt
-- bewust NIET teruggegeven.
-- =========================================

create or replace function public.get_claim_summary(p_claim_id uuid)
returns table (
  claim_id        uuid,
  code            text,
  claim_status    claim_status,
  slot_id         uuid,
  start_tijd      timestamptz,
  kortingsprijs   numeric,
  normale_prijs   numeric,
  behandeling_naam text,
  business_naam   text,
  business_slug   text,
  business_adres  text,
  business_foto_url text,
  business_instagram text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.id, c.code, c.status,
    s.id, s.start_tijd, s.kortingsprijs, s.normale_prijs, s.behandeling_naam,
    b.naam, b.slug, b.adres, b.foto_url, b.instagram
  from public.claims c
  join public.slots s      on s.id = c.slot_id
  join public.businesses b on b.id = s.business_id
  where c.id = p_claim_id
$$;

revoke all on function public.get_claim_summary(uuid) from public;
grant execute on function public.get_claim_summary(uuid) to anon, authenticated;

-- ------------------------------------------------------------
-- cancel_claim(p_claim_id uuid)
-- Zet claim op 'geannuleerd' en re-opent het slot.
-- Enkel toegelaten als:
--   - claim.status = 'bevestigd'
--   - slot.start_tijd > now() + 3 uur
-- ------------------------------------------------------------

create or replace function public.cancel_claim(p_claim_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot_id    uuid;
  v_start_tijd timestamptz;
  v_claim_status claim_status;
begin
  select c.status, s.id, s.start_tijd
    into v_claim_status, v_slot_id, v_start_tijd
    from public.claims c
    join public.slots s on s.id = c.slot_id
    where c.id = p_claim_id
    for update of c, s;

  if not found then
    raise exception 'claim_not_found';
  end if;

  if v_claim_status <> 'bevestigd' then
    raise exception 'claim_niet_bevestigd';
  end if;

  if v_start_tijd <= now() + interval '3 hours' then
    raise exception 'te_laat_om_te_annuleren';
  end if;

  update public.claims
    set status = 'geannuleerd'
    where id = p_claim_id;

  update public.slots
    set status = 'open'
    where id = v_slot_id;
end
$$;

revoke all on function public.cancel_claim(uuid) from public;
grant execute on function public.cancel_claim(uuid) to anon, authenticated;

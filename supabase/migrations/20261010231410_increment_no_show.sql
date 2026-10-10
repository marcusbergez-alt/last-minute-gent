-- =========================================
-- Fase 1: RPC voor zaak om aantal_no_shows van een klant te verhogen.
-- Zaak heeft geen directe UPDATE-rechten op customers (RLS), dus dit
-- loopt via een security-definer-functie die checkt dat de bijhorende
-- claim bij een slot van de zaak-owner hoort.
-- =========================================

create or replace function public.increment_no_show(p_customer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_mag boolean;
begin
  -- Mag enkel verhogen als er een claim bestaat die (1) deze customer heeft
  -- en (2) hoort bij een slot van een business die de huidige user bezit.
  select exists (
    select 1
    from public.claims c
    join public.slots s     on s.id = c.slot_id
    join public.businesses b on b.id = s.business_id
    where c.customer_id = p_customer_id
      and b.owner_user_id = auth.uid()
  ) into v_mag;

  if not v_mag then
    raise exception 'niet_toegestaan';
  end if;

  update public.customers
    set aantal_no_shows = aantal_no_shows + 1
    where id = p_customer_id;
end
$$;

revoke all on function public.increment_no_show(uuid) from public;
grant execute on function public.increment_no_show(uuid) to authenticated;

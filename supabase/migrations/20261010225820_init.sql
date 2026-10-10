-- =========================================
-- Startup 1 – initial schema
-- Last-minute afspraken voor Gentse salons
-- =========================================

-- Extensions ---------------------------------------------------------------
create extension if not exists "pgcrypto";       -- gen_random_uuid()
create extension if not exists "pg_trgm";        -- toekomstig: fuzzy search

-- Enums --------------------------------------------------------------------
create type business_type as enum
  ('kapper','nagelstudio','wimperstudio','schoonheidsspecialist');

create type business_status as enum
  ('aangemeld','goedgekeurd','gepauzeerd');

create type slot_status as enum
  ('open','geclaimd','voorbij','geannuleerd');

create type claim_status as enum
  ('bevestigd','geannuleerd','gekomen','niet_gekomen');

-- Helper: admin check ------------------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce((auth.jwt() ->> 'email') = 'marcus.bergez@gmail.com', false)
$$;

-- Tables -------------------------------------------------------------------
create table public.businesses (
  id              uuid primary key default gen_random_uuid(),
  naam            text not null,
  slug            text not null unique,
  type            business_type not null,
  adres           text,
  foto_url        text,
  instagram       text,
  email           text,
  gsm             text,
  status          business_status not null default 'aangemeld',
  owner_user_id   uuid references auth.users(id) on delete set null,
  aangemaakt_op   timestamptz not null default now()
);
create index businesses_status_idx on public.businesses(status);
create index businesses_owner_idx  on public.businesses(owner_user_id);

create table public.services (
  id              uuid primary key default gen_random_uuid(),
  business_id     uuid not null references public.businesses(id) on delete cascade,
  naam            text not null,
  standaardprijs  numeric(10,2) not null check (standaardprijs >= 0),
  duur_minuten    int not null check (duur_minuten > 0)
);
create index services_business_idx on public.services(business_id);

create table public.slots (
  id              uuid primary key default gen_random_uuid(),
  business_id     uuid not null references public.businesses(id) on delete cascade,
  service_id      uuid not null references public.services(id) on delete restrict,
  start_tijd      timestamptz not null,
  normale_prijs   numeric(10,2) not null check (normale_prijs > 0),
  kortingsprijs   numeric(10,2) not null check (kortingsprijs >= 0),
  status          slot_status not null default 'open',
  aangemaakt_op   timestamptz not null default now(),
  check (kortingsprijs < normale_prijs)
);
create index slots_status_tijd_idx    on public.slots(status, start_tijd);
create index slots_business_tijd_idx  on public.slots(business_id, start_tijd desc);

create table public.customers (
  id                     uuid primary key default gen_random_uuid(),
  naam                   text not null,
  gsm                    text not null,
  email                  text not null,
  toestemming_marketing  boolean not null default false,
  bron                   text,
  aantal_no_shows        int not null default 0,
  aangemaakt_op          timestamptz not null default now()
);
create index customers_gsm_idx on public.customers(gsm);

create table public.claims (
  id             uuid primary key default gen_random_uuid(),
  slot_id        uuid not null references public.slots(id) on delete cascade,
  customer_id    uuid not null references public.customers(id) on delete restrict,
  code           text not null check (char_length(code) = 4),
  status         claim_status not null default 'bevestigd',
  aangemaakt_op  timestamptz not null default now()
);
-- Max één actieve claim per slot (atomariteit via unique partial index).
create unique index claims_actieve_per_slot
  on public.claims(slot_id) where status = 'bevestigd';
create index claims_slot_idx on public.claims(slot_id);
create index claims_customer_idx on public.claims(customer_id);

create table public.subscribers (
  id                   uuid primary key default gen_random_uuid(),
  email                text not null unique,
  voorkeur_behandeling text,
  bron                 text,
  aangemaakt_op        timestamptz not null default now()
);

-- Enable RLS ---------------------------------------------------------------
alter table public.businesses  enable row level security;
alter table public.services    enable row level security;
alter table public.slots       enable row level security;
alter table public.customers   enable row level security;
alter table public.claims      enable row level security;
alter table public.subscribers enable row level security;

-- Policies: businesses -----------------------------------------------------
create policy "businesses_select_public_goedgekeurd" on public.businesses
  for select using (status = 'goedgekeurd');

create policy "businesses_select_own" on public.businesses
  for select using (owner_user_id = auth.uid());

create policy "businesses_insert_self" on public.businesses
  for insert with check (
    owner_user_id = auth.uid() and status = 'aangemeld'
  );

create policy "businesses_update_own" on public.businesses
  for update
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid() and status = 'aangemeld');
  -- status wijzigen is admin-only (zie admin policy)

create policy "businesses_admin_all" on public.businesses
  for all using (public.is_admin()) with check (public.is_admin());

-- Policies: services -------------------------------------------------------
create policy "services_select_public" on public.services
  for select using (exists (
    select 1 from public.businesses b
    where b.id = services.business_id and b.status = 'goedgekeurd'
  ));

create policy "services_owner_all" on public.services
  for all using (exists (
    select 1 from public.businesses b
    where b.id = services.business_id and b.owner_user_id = auth.uid()
  )) with check (exists (
    select 1 from public.businesses b
    where b.id = services.business_id and b.owner_user_id = auth.uid()
  ));

create policy "services_admin_all" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- Policies: slots ----------------------------------------------------------
create policy "slots_select_public_open" on public.slots
  for select using (
    status = 'open' and start_tijd > now()
    and exists (
      select 1 from public.businesses b
      where b.id = slots.business_id and b.status = 'goedgekeurd'
    )
  );

create policy "slots_owner_all" on public.slots
  for all using (exists (
    select 1 from public.businesses b
    where b.id = slots.business_id and b.owner_user_id = auth.uid()
  )) with check (exists (
    select 1 from public.businesses b
    where b.id = slots.business_id and b.owner_user_id = auth.uid()
  ));

create policy "slots_admin_all" on public.slots
  for all using (public.is_admin()) with check (public.is_admin());

-- Policies: customers ------------------------------------------------------
-- Geen publieke SELECT. Business leest alleen via join met eigen claim.
create policy "customers_select_own_business" on public.customers
  for select using (exists (
    select 1 from public.claims c
    join public.slots s     on s.id = c.slot_id
    join public.businesses b on b.id = s.business_id
    where c.customer_id = customers.id
      and b.owner_user_id = auth.uid()
  ));

create policy "customers_admin_all" on public.customers
  for all using (public.is_admin()) with check (public.is_admin());

-- INSERT op customers verloopt uitsluitend via claim_slot() (security definer).

-- Policies: claims ---------------------------------------------------------
create policy "claims_select_own_business" on public.claims
  for select using (exists (
    select 1 from public.slots s
    join public.businesses b on b.id = s.business_id
    where s.id = claims.slot_id and b.owner_user_id = auth.uid()
  ));

create policy "claims_update_own_business" on public.claims
  for update using (exists (
    select 1 from public.slots s
    join public.businesses b on b.id = s.business_id
    where s.id = claims.slot_id and b.owner_user_id = auth.uid()
  )) with check (exists (
    select 1 from public.slots s
    join public.businesses b on b.id = s.business_id
    where s.id = claims.slot_id and b.owner_user_id = auth.uid()
  ));

create policy "claims_admin_all" on public.claims
  for all using (public.is_admin()) with check (public.is_admin());

-- INSERT op claims verloopt uitsluitend via claim_slot() (security definer).

-- Policies: subscribers ----------------------------------------------------
create policy "subscribers_insert_public" on public.subscribers
  for insert with check (true);

create policy "subscribers_admin_select" on public.subscribers
  for select using (public.is_admin());

create policy "subscribers_admin_all" on public.subscribers
  for all using (public.is_admin()) with check (public.is_admin());

-- Atomair claim-slot --------------------------------------------------------
create or replace function public.claim_slot(
  p_slot_id       uuid,
  p_naam          text,
  p_gsm           text,
  p_email         text,
  p_toestemming   boolean,
  p_bron          text
)
returns table (claim_id uuid, code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot            public.slots%rowtype;
  v_customer_id     uuid;
  v_customer_no_shows int;
  v_code            text;
  v_claim_id        uuid;
begin
  select * into v_slot from public.slots where id = p_slot_id for update;
  if not found then
    raise exception 'slot_not_found';
  end if;
  if v_slot.status <> 'open' then
    raise exception 'slot_not_open';
  end if;
  if v_slot.start_tijd <= now() then
    raise exception 'slot_expired';
  end if;

  -- v1-vereenvoudiging: dedupeer customer op gsm; anders insert nieuw.
  select id, aantal_no_shows into v_customer_id, v_customer_no_shows
    from public.customers where gsm = p_gsm limit 1;

  if v_customer_id is null then
    insert into public.customers (naam, gsm, email, toestemming_marketing, bron)
      values (p_naam, p_gsm, p_email, p_toestemming, p_bron)
      returning id, aantal_no_shows into v_customer_id, v_customer_no_shows;
  end if;

  if v_customer_no_shows >= 2 then
    raise exception 'customer_blocked';
  end if;

  v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));

  insert into public.claims (slot_id, customer_id, code)
    values (p_slot_id, v_customer_id, v_code)
    returning id into v_claim_id;

  update public.slots set status = 'geclaimd' where id = p_slot_id;

  claim_id := v_claim_id;
  code := v_code;
  return next;
end
$$;

revoke all on function public.claim_slot(uuid, text, text, text, boolean, text) from public;
grant execute on function public.claim_slot(uuid, text, text, text, boolean, text)
  to anon, authenticated;

-- =========================================
-- Fase 1: slots mogen een vrije behandelingsnaam hebben.
-- Services (behandelingen-CRUD) volgt in Fase 2; tot dan is
-- service_id optioneel en vullen we behandeling_naam in.
-- =========================================

alter table public.slots
  alter column service_id drop not null;

alter table public.slots
  add column behandeling_naam text;

-- Elke slot moet minstens één van beide hebben.
alter table public.slots
  add constraint slot_behandeling_present
    check (service_id is not null or behandeling_naam is not null);

export const BUSINESS_TYPES = [
  "kapper",
  "nagelstudio",
  "wimperstudio",
  "schoonheidsspecialist",
] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const BUSINESS_TYPE_LABEL: Record<BusinessType, string> = {
  kapper: "Kapper",
  nagelstudio: "Nagelstudio",
  wimperstudio: "Wimperstudio",
  schoonheidsspecialist: "Schoonheidsspecialist",
};

export type BusinessStatus = "aangemeld" | "goedgekeurd" | "gepauzeerd";

export const BUSINESS_STATUS_LABEL: Record<BusinessStatus, string> = {
  aangemeld: "In behandeling",
  goedgekeurd: "Goedgekeurd",
  gepauzeerd: "Gepauzeerd",
};

export type SlotStatus = "open" | "geclaimd" | "voorbij" | "geannuleerd";

export const SLOT_STATUS_LABEL: Record<SlotStatus, string> = {
  open: "Open",
  geclaimd: "Geclaimd",
  voorbij: "Voorbij",
  geannuleerd: "Geannuleerd",
};

export type ClaimStatus =
  | "bevestigd"
  | "geannuleerd"
  | "gekomen"
  | "niet_gekomen";

export type Business = {
  id: string;
  naam: string;
  slug: string;
  type: BusinessType;
  adres: string | null;
  foto_url: string | null;
  instagram: string | null;
  email: string | null;
  gsm: string | null;
  status: BusinessStatus;
  owner_user_id: string | null;
  aangemaakt_op: string;
};

export type Slot = {
  id: string;
  business_id: string;
  service_id: string | null;
  behandeling_naam: string | null;
  start_tijd: string;
  normale_prijs: number;
  kortingsprijs: number;
  status: SlotStatus;
  aangemaakt_op: string;
};

export type Claim = {
  id: string;
  slot_id: string;
  customer_id: string;
  code: string;
  status: ClaimStatus;
  aangemaakt_op: string;
};

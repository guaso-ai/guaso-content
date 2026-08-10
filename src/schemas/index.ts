export * from "./blocks.js";
export * as artist from "./templates/artist.js";
export * as store from "./templates/store.js";
export * as restaurant from "./templates/restaurant.js";
export * as realEstate from "./templates/real-estate.js";
export * as gym from "./templates/gym.js";
export * as clinic from "./templates/clinic.js";
export * as professional from "./templates/professional.js";
export * as beauty from "./templates/beauty.js";
export * as bio from "./templates/bio.js";

export const TEMPLATE_IDS = [
  "artist",
  "store",
  "restaurant",
  "real-estate",
  "gym",
  "clinic",
  "professional",
  "beauty",
  "bio",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

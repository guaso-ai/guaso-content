import type { SiteColorConfig } from "./_site-colors.js";

export type GymClass = {
  name?: string;
  instructor?: string;
  schedule?: string;
  level?: string;
  description?: string;
  image?: string;
};

export type GymPlan = {
  name?: string;
  period?: string;
};

export type GymTrainer = {
  name?: string;
  specialty?: string;
  bio?: string;
  image?: string;
};

export type GymHomePage = {
  features?: unknown;
  stats?: unknown;
};

export type GymConfig = SiteColorConfig & {
  siteName?: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  "hours.weekdays"?: string;
  "hours.weekends"?: string;
  "socialLinks.instagram"?: string;
  "socialLinks.facebook"?: string;
  "socialLinks.youtube"?: string;
};

export const GYM_PARITY = {
  pages: {
    home: ["features", "stats"],
  },
  collections: {
    classes: {
      content_key: "classes/classes",
      item_fields: ["name", "instructor", "schedule", "level", "description"],
      id_field: "name",
    },
    plans: {
      content_key: "plans/plans",
      item_fields: ["name", "period"],
      id_field: "name",
    },
    trainers: {
      content_key: "trainers/trainers",
      item_fields: ["name", "specialty", "bio"],
      id_field: "name",
    },
  },
  config_fields: [
    "accentColor",
    "address",
    "appearanceDefault",
    "appearanceToggle",
    "contactEmail",
    "description",
    "fontPair",
    "hours.weekdays",
    "hours.weekends",
    "phone",
    "primaryColor",
    "secondaryColor",
    "siteName",
    "socialLinks.facebook",
    "socialLinks.instagram",
    "socialLinks.youtube",
    "styles.accentColor",
    "styles.appearanceDefault",
    "styles.appearanceToggle",
    "styles.fontPair",
    "styles.primaryColor",
    "styles.secondaryColor",
    "tagline",
    "whatsapp",
  ],
} as const;

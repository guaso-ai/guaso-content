import type { SiteColorConfig } from "./_site-colors.js";

export type ClinicService = {
  name?: string;
  description?: string;
  duration?: string;
  preparation?: string;
};

export type ClinicTeamMember = {
  name?: string;
  specialty?: string;
  bio?: string;
  image?: string;
};

export type ClinicHomePage = {
  welcome_text?: string;
  features?: unknown;
  stats?: unknown;
};

export type ClinicBookingPage = {
  instructions?: string;
  available_days?: string;
  methods?: unknown;
};

export type ClinicConfig = SiteColorConfig & {
  siteName?: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  specialty?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  "hours.weekdays"?: string;
  "hours.weekends"?: string;
  "socialLinks.instagram"?: string;
  "socialLinks.facebook"?: string;
};

export const CLINIC_PARITY = {
  pages: {
    home: ["welcome_text", "features", "stats"],
    booking: ["instructions", "available_days", "methods"],
  },
  collections: {
    services: {
      content_key: "services/services",
      item_fields: ["name", "description", "duration", "preparation"],
      id_field: "name",
    },
    team: {
      content_key: "team/team",
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
    "specialty",
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

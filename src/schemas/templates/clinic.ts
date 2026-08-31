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
  hero_title?: string;
  hero_kicker?: string;
  hero_badge?: string;
  why_heading?: string;
  cta_primary?: string;
  value_props?: unknown;
  section_headings?: unknown;
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
  formSubmit?: string;
  "nav.home"?: string;
  "nav.servicios"?: string;
  "nav.equipo"?: string;
  "nav.turnos"?: string;
  "nav.contacto"?: string;
};

export const CLINIC_PARITY = {
  pages: {
    home: [
        "cta_primary",
        "features",
        "hero_badge",
        "hero_kicker",
        "hero_title",
        "section_headings",
        "stats",
        "value_props",
        "welcome_text",
        "why_heading",
      ],
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
      "formSubmit",
      "hours.weekdays",
      "hours.weekends",
      "nav.contacto",
      "nav.equipo",
      "nav.home",
      "nav.servicios",
      "nav.turnos",
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

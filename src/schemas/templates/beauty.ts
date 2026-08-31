import type { SiteColorConfig } from "./_site-colors.js";

export type BeautyService = {
  name?: string;
  category?: string;
  duration?: string;
  description?: string;
};

export type BeautyGalleryImage = {
  src?: string;
  alt?: string;
  category?: string;
};

export type BeautyTeamMember = {
  name?: string;
  role?: string;
  bio?: string;
  image?: string;
};

export type BeautyHomePage = {
  welcome_text?: string;
  features?: unknown;
  testimonials?: unknown;
  hero_kicker?: string;
  hero_footer?: string;
  cta_primary?: string;
  cta_title?: string;
  section_headings?: unknown;
};

export type BeautyBookingPage = {
  instructions?: string;
  available_days?: string;
  methods?: unknown;
};

export type BeautyConfig = SiteColorConfig & {
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
  "socialLinks.tiktok"?: string;
  formSubmit?: string;
  formSuccess?: string;
  "nav.home"?: string;
  "nav.servicios"?: string;
  "nav.galeria"?: string;
  "nav.turnos"?: string;
  "nav.contacto"?: string;
};

export const BEAUTY_PARITY = {
  pages: {
    home: [
        "cta_primary",
        "cta_title",
        "features",
        "hero_footer",
        "hero_kicker",
        "section_headings",
        "testimonials",
        "welcome_text",
      ],
    booking: ["instructions", "available_days", "methods"],
  },
  collections: {
    services: {
      content_key: "services/services",
      item_fields: ["name", "category", "duration", "description"],
      id_field: "name",
    },
    gallery: {
      content_key: "gallery/images",
      item_fields: ["alt", "category"],
      id_field: "src",
    },
    team: {
      content_key: "team/team",
      item_fields: ["name", "role", "bio"],
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
      "formSuccess",
      "hours.weekdays",
      "hours.weekends",
      "nav.contacto",
      "nav.galeria",
      "nav.home",
      "nav.servicios",
      "nav.turnos",
      "phone",
      "primaryColor",
      "secondaryColor",
      "siteName",
      "socialLinks.facebook",
      "socialLinks.instagram",
      "socialLinks.tiktok",
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

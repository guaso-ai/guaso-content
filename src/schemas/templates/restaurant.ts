import type { SiteColorConfig } from "./_site-colors.js";

export type RestaurantGalleryImage = {
  src?: string;
  alt?: string;
  category?: string;
};

export type RestaurantHomePage = {
  title?: string;
  hero_kicker?: string;
  hero_subtitle?: string;
  hero_rail?: string;
  hero_badge?: string;
  features?: unknown;
  events_title?: string;
  events_description?: string;
  cta_primary?: string;
  cta_secondary?: string;
  section_headings?: unknown;
};

export type RestaurantAboutPage = {
  story?: string;
  story_2?: string;
  chef_bio?: string;
  stats?: unknown;
  values?: unknown;
};

export type RestaurantConfig = SiteColorConfig & {
  siteName?: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  "hours.weekdays"?: string;
  "hours.weekends"?: string;
  reservationsLink?: string;
  "socialLinks.instagram"?: string;
  "socialLinks.facebook"?: string;
  formSubmit?: string;
  formSuccess?: string;
  "nav.home"?: string;
  "nav.menu"?: string;
  "nav.nosotros"?: string;
  "nav.galeria"?: string;
  "nav.contacto"?: string;
};

export const RESTAURANT_PARITY = {
  pages: {
    home: [
        "cta_primary",
        "cta_secondary",
        "events_description",
        "events_title",
        "features",
        "hero_badge",
        "hero_kicker",
        "hero_rail",
        "hero_subtitle",
        "section_headings",
        "title",
      ],
    about: [
        "chef_bio",
        "stats",
        "story",
        "story_2",
        "values",
      ],
  },
  collections: {
    menu: {
      content_key: "menu/menu",
      item_fields: [],
    },
    gallery: {
      content_key: "gallery/images",
      item_fields: ["alt", "category"],
      id_field: "src",
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
      "nav.menu",
      "nav.nosotros",
      "phone",
      "primaryColor",
      "reservationsLink",
      "secondaryColor",
      "siteName",
      "socialLinks.facebook",
      "socialLinks.instagram",
      "styles.accentColor",
      "styles.appearanceDefault",
      "styles.appearanceToggle",
      "styles.fontPair",
      "styles.primaryColor",
      "styles.secondaryColor",
      "tagline",
    ],
} as const;

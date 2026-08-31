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
};

export const RESTAURANT_PARITY = {
  pages: {
    home: ["title", "hero_kicker", "hero_subtitle", "hero_rail", "hero_badge", "features", "events_title", "events_description"],
    about: ["story", "story_2", "chef_bio", "stats", "values"],
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
    "hours.weekdays",
    "hours.weekends",
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

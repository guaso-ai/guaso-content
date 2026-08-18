import type { SiteColorConfig } from "./_site-colors.js";

export type RestaurantGalleryImage = {
  src?: string;
  alt?: string;
  category?: string;
};

export type RestaurantHomePage = {
  hero_subtitle?: string;
  features?: unknown;
  events_title?: string;
  events_description?: string;
};

export type RestaurantAboutPage = {
  story?: string;
  chef_bio?: string;
  stats?: unknown;
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
    home: ["hero_subtitle", "features", "events_title", "events_description"],
    about: ["story", "chef_bio", "stats"],
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

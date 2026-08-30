import type { SiteColorConfig } from "./_site-colors.js";

export type Availability = "in_stock" | "preorder" | "made_to_order";

export type StoreProduct = {
  slug?: string;
  name?: string;
  description?: string;
  category?: string;
  images?: string[];
  availability?: Availability;
};

export type StoreHomePage = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  cta_title?: string;
  cta_description?: string;
  features?: unknown;
  highlights?: unknown;
};

export type StoreConfig = SiteColorConfig & {
  siteName?: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  shippingInfo?: string;
  currency?: string;
  currencySymbol?: string;
  "socialLinks.instagram"?: string;
  "socialLinks.twitter"?: string;
  "socialLinks.facebook"?: string;
};

export const STORE_PARITY = {
  pages: {
    home: [
      "cta_description",
      "cta_title",
      "features",
      "heroEyebrow",
      "heroSubtitle",
      "heroTitle",
      "highlights",
    ],
  },
  collections: {
    products: {
      content_key: "products/products",
      item_fields: ["availability", "category", "description", "name"],
      id_field: "slug",
    },
  },
  config_fields: [
    "accentColor",
    "appearanceDefault",
    "appearanceToggle",
    "contactEmail",
    "currency",
    "currencySymbol",
    "description",
    "fontPair",
    "primaryColor",
    "secondaryColor",
    "shippingInfo",
    "siteName",
    "socialLinks.facebook",
    "socialLinks.instagram",
    "socialLinks.twitter",
    "styles.accentColor",
    "styles.appearanceDefault",
    "styles.appearanceToggle",
    "styles.fontPair",
    "styles.primaryColor",
    "styles.secondaryColor",
    "tagline",
  ],
} as const;

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
  catalogTitle?: string;
  emptyState?: string;
  sectionHeadings?: unknown;
};

export type StoreConfig = SiteColorConfig & {
  siteName?: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  shippingInfo?: string;
  currency?: string;
  currencySymbol?: string;
  "socialLinks.instagram"?: string;
  "socialLinks.twitter"?: string;
  "socialLinks.facebook"?: string;
  formSubmit?: string;
  formSuccess?: string;
  "nav.home"?: string;
  "nav.store"?: string;
};

export const STORE_PARITY = {
  pages: {
    home: [
        "catalogTitle",
        "cta_description",
        "cta_title",
        "emptyState",
        "features",
        "heroEyebrow",
        "heroSubtitle",
        "heroTitle",
        "highlights",
        "sectionHeadings",
      ],
  },
  collections: {
    products: {
      content_key: "products/products",
      item_fields: ["availability", "category", "description", "featured", "name"],
      id_field: "slug",
    },
  },
  config_fields: [
      "accentColor",
      "address",
      "appearanceDefault",
      "appearanceToggle",
      "contactEmail",
      "contactPhone",
      "currency",
      "currencySymbol",
      "description",
      "fontPair",
      "formSubmit",
      "formSuccess",
      "nav.home",
      "nav.store",
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

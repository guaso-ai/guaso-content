import type { SiteColorConfig } from "./_site-colors.js";

export type Availability = "in_stock" | "preorder" | "made_to_order";

export type StoreProduct = {
  slug?: string;
  name?: string;
  description?: string;
  category?: string;
  images?: string[];
  price?: number;
  quantity?: number;
  availability?: Availability;
};

export type StoreHomePage = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
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
        "emptyState",
        "heroEyebrow",
        "heroSubtitle",
        "heroTitle",
        "sectionHeadings",
      ],
  },
  collections: {
    products: {
      content_key: "products/products",
      item_fields: ["availability", "category", "description", "featured", "name", "price", "quantity"],
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

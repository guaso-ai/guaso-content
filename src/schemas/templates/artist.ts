import type { SiteColorConfig } from "./_site-colors.js";

export type ArtistBlogPost = {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  date?: string;
  coverImage?: string;
};

export type ArtistProject = {
  slug?: string;
  title?: string;
  description?: string;
  year?: string;
  tags?: string;
  coverImage?: string;
  images?: string[];
};

export type ArtistProduct = {
  slug?: string;
  name?: string;
  description?: string;
  category?: string;
  images?: string[];
  price?: number;
  quantity?: number;
  availability?: string;
  featured?: boolean;
  tags?: string[];
  compareAtPrice?: number;
};

export type ArtistGalleryImage = {
  src?: string;
  alt?: string;
  category?: string;
};

export type ArtistHomePage = {
  artwork_label?: string;
  artwork_technique?: string;
  hero_kicker?: string;
  hero_rail?: unknown;
  cta_primary?: string;
  cta_secondary?: string;
  featured_heading?: string;
  section_headings?: unknown;
};

export type ArtistAboutPage = {
  bio_paragraph_1?: string;
  bio_paragraph_2?: string;
  photoUrl?: string;
  stats?: unknown;
  process?: unknown;
  exhibitions?: unknown;
};

export type ArtistContactPage = {
  location?: string;
  response_time?: string;
  intro_text?: string;
};

export type ArtistConfig = SiteColorConfig & {
  siteName?: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  "socialLinks.instagram"?: string;
  "socialLinks.twitter"?: string;
  "socialLinks.behance"?: string;
  "socialLinks.linkedin"?: string;
  formSubmit?: string;
  currency?: string;
  currencySymbol?: string;
  heroImage?: string;
  logo?: string;
  "nav.home"?: string;
  "nav.about"?: string;
  "nav.gallery"?: string;
  "nav.projects"?: string;
  "nav.blog"?: string;
  "nav.store"?: string;
  "nav.contact"?: string;
};

export const ARTIST_PARITY = {
  pages: {
    home: [
        "artwork_label",
        "artwork_technique",
        "cta_primary",
        "cta_secondary",
        "featured_heading",
        "hero_kicker",
        "hero_rail",
        "section_headings",
      ],
    about: [
        "bio_paragraph_1",
        "bio_paragraph_2",
        "exhibitions",
        "photoUrl",
        "process",
        "stats",
      ],
    contact: ["location", "response_time", "intro_text"],
  },
  collections: {
    blog: {
      content_key: "blog/posts",
      item_fields: ["content", "date", "excerpt", "title"],
      id_field: "slug",
    },
    projects: {
      content_key: "projects/projects",
      item_fields: ["description", "tags", "title", "year"],
      id_field: "slug",
    },
    products: {
      content_key: "products/products",
      item_fields: ["availability", "category", "compareAtPrice", "description", "featured", "name", "price", "quantity", "tags"],
      id_field: "slug",
    },
    gallery: {
      content_key: "gallery/images",
      item_fields: ["alt", "category"],
      id_field: "src",
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
      "formSubmit",
      "heroImage",
      "logo",
      "nav.about",
      "nav.blog",
      "nav.contact",
      "nav.gallery",
      "nav.home",
      "nav.projects",
      "nav.store",
      "primaryColor",
      "secondaryColor",
      "siteName",
      "socialLinks.behance",
      "socialLinks.instagram",
      "socialLinks.linkedin",
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

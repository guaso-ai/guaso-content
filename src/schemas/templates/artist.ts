import type { SiteColorConfig } from "./_site-colors.js";

export type ArtistBlogPost = {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
};

export type ArtistProject = {
  slug?: string;
  title?: string;
  description?: string;
  coverImage?: string;
  images?: string[];
};

export type ArtistGalleryImage = {
  src?: string;
  alt?: string;
  category?: string;
};

export type ArtistHomePage = {
  intro_text?: string;
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
  "nav.home"?: string;
  "nav.about"?: string;
  "nav.gallery"?: string;
  "nav.projects"?: string;
  "nav.blog"?: string;
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
        "intro_text",
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
      item_fields: ["title", "excerpt", "content"],
      id_field: "slug",
    },
    projects: {
      content_key: "projects/projects",
      item_fields: ["title", "description"],
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
      "description",
      "fontPair",
      "formSubmit",
      "nav.about",
      "nav.blog",
      "nav.contact",
      "nav.gallery",
      "nav.home",
      "nav.projects",
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

import type { SiteColorConfig } from "./_site-colors.js";

export type BioLink = {
  label?: string;
  url?: string;
  description?: string;
};

export type BioBlogPost = {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
};

export type BioHomePage = {
  bio?: string;
  headline?: string;
  blog_heading?: string;
  section_headings?: unknown;
};

export type BioConfig = SiteColorConfig & {
  siteName?: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  heroImage?: string;
  "socialLinks.instagram"?: string;
  "socialLinks.tiktok"?: string;
  "socialLinks.youtube"?: string;
  "socialLinks.twitter"?: string;
  "socialLinks.linkedin"?: string;
  "socialLinks.spotify"?: string;
  "socialLinks.whatsapp"?: string;
  "nav.home"?: string;
  "nav.blog"?: string;
};

export const BIO_PARITY = {
  pages: {
    home: [
        "bio",
        "blog_heading",
        "headline",
        "section_headings",
      ],
  },
  collections: {
    links: {
      content_key: "links/links",
      item_fields: ["label", "url", "description"],
      id_field: "label",
    },
    blog: {
      content_key: "blog/posts",
      item_fields: ["title", "excerpt", "content"],
      id_field: "slug",
    },
  },
  config_fields: [
      "accentColor",
      "appearanceDefault",
      "appearanceToggle",
      "contactEmail",
      "description",
      "fontPair",
      "heroImage",
      "nav.blog",
      "nav.home",
      "primaryColor",
      "secondaryColor",
      "siteName",
      "socialLinks.instagram",
      "socialLinks.linkedin",
      "socialLinks.spotify",
      "socialLinks.tiktok",
      "socialLinks.twitter",
      "socialLinks.whatsapp",
      "socialLinks.youtube",
      "styles.accentColor",
      "styles.appearanceDefault",
      "styles.appearanceToggle",
      "styles.fontPair",
      "styles.primaryColor",
      "styles.secondaryColor",
      "tagline",
    ],
} as const;

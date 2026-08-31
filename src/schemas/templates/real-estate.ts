import type { SiteColorConfig } from "./_site-colors.js";

export type RealEstateProperty = {
  slug?: string;
  title?: string;
  description?: string;
  address?: string;
  images?: string[];
};

export type RealEstateTeamMember = {
  name?: string;
  role?: string;
  bio?: string;
  photo?: string;
};

export type RealEstateHomePage = {
  stats?: unknown;
  features?: unknown;
  hero_title?: string;
  services?: unknown;
  cta_primary?: string;
  cta_secondary?: string;
  section_headings?: unknown;
};

export type RealEstateAboutPage = {
  story?: string;
  team_bio?: string;
  values?: unknown;
};

export type RealEstateConfig = SiteColorConfig & {
  siteName?: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  phone?: string;
  whatsapp?: string;
  zone?: string;
  licenseNumber?: string;
  formSubmit?: string;
  formSuccess?: string;
  "nav.home"?: string;
  "nav.propiedades"?: string;
  "nav.nosotros"?: string;
  "nav.contacto"?: string;
};

export const REAL_ESTATE_PARITY = {
  pages: {
    home: [
        "cta_primary",
        "cta_secondary",
        "features",
        "hero_title",
        "section_headings",
        "services",
        "stats",
      ],
    about: [
        "story",
        "team_bio",
        "values",
      ],
  },
  collections: {
    properties: {
      content_key: "properties/properties",
      item_fields: ["title", "description", "address"],
      id_field: "slug",
    },
    team: {
      content_key: "team/team",
      item_fields: ["name", "role", "bio"],
      id_field: "name",
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
      "formSuccess",
      "licenseNumber",
      "nav.contacto",
      "nav.home",
      "nav.nosotros",
      "nav.propiedades",
      "phone",
      "primaryColor",
      "secondaryColor",
      "siteName",
      "styles.accentColor",
      "styles.appearanceDefault",
      "styles.appearanceToggle",
      "styles.fontPair",
      "styles.primaryColor",
      "styles.secondaryColor",
      "tagline",
      "whatsapp",
      "zone",
    ],
} as const;

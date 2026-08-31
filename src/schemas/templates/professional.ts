import type { SiteColorConfig } from "./_site-colors.js";

export type ProfessionalService = {
  name?: string;
  description?: string;
};

export type ProfessionalTestimonial = {
  name?: string;
  role?: string;
  company?: string;
  text?: string;
};

export type ProfessionalTeamMember = {
  name?: string;
  role?: string;
  bio?: string;
  photo?: string;
};

/** Empty fields — home is blocks target only (modo creativo). */
export type ProfessionalHomePage = Record<string, never>;

export type ProfessionalAboutPage = {
  bio?: string;
  mission?: string;
  credentials?: unknown;
  stats?: unknown;
  timeline?: unknown;
  values?: unknown;
};

export type ProfessionalContactPage = {
  location?: string;
  availability?: string;
};

export type ProfessionalConfig = SiteColorConfig & {
  siteName?: string;
  tagline?: string;
  description?: string;
  contactEmail?: string;
  profession?: string;
  specialty?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  "socialLinks.linkedin"?: string;
  "socialLinks.instagram"?: string;
  "socialLinks.twitter"?: string;
  formSubmit?: string;
  formSuccess?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  ctaTitle?: string;
  servicesHeading?: string;
  teamHeading?: string;
  testimonialsHeading?: string;
  "nav.home"?: string;
  "nav.servicios"?: string;
  "nav.nosotros"?: string;
  "nav.equipo"?: string;
  "nav.testimonios"?: string;
  "nav.contacto"?: string;
};

export const PROFESSIONAL_PARITY = {
  pages: {
    home: [
,
      ],
    about: [
        "bio",
        "credentials",
        "mission",
        "stats",
        "timeline",
        "values",
      ],
    contact: ["location", "availability"],
  },
  collections: {
    services: {
      content_key: "services/services",
      item_fields: ["name", "description"],
      id_field: "name",
    },
    testimonials: {
      content_key: "testimonials/testimonials",
      item_fields: ["name", "role", "company", "text"],
      id_field: "name",
    },
    team: {
      content_key: "team/team",
      item_fields: ["name", "role", "bio"],
      id_field: "name",
    },
  },
  config_fields: [
      "accentColor",
      "address",
      "appearanceDefault",
      "appearanceToggle",
      "contactEmail",
      "ctaPrimary",
      "ctaSecondary",
      "ctaTitle",
      "description",
      "fontPair",
      "formSubmit",
      "formSuccess",
      "nav.contacto",
      "nav.equipo",
      "nav.home",
      "nav.nosotros",
      "nav.servicios",
      "nav.testimonios",
      "phone",
      "primaryColor",
      "profession",
      "secondaryColor",
      "servicesHeading",
      "siteName",
      "socialLinks.instagram",
      "socialLinks.linkedin",
      "socialLinks.twitter",
      "specialty",
      "styles.accentColor",
      "styles.appearanceDefault",
      "styles.appearanceToggle",
      "styles.fontPair",
      "styles.primaryColor",
      "styles.secondaryColor",
      "tagline",
      "teamHeading",
      "testimonialsHeading",
      "whatsapp",
    ],
} as const;

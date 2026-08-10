/** Canonical block catalog shapes — mirror of `_CANONICAL_BLOCKS` (Python SoT).
 * Client-safe subpath — no poison import (safe for UI / RSC, e.g. guaso-blocks).
 */

export type CanonicalBlockType =
  | "RichSection"
  | "Gallery"
  | "Cards"
  | "Testimonials"
  | "CTA";

export type RichSectionData = {
  title?: string;
  body?: string;
  cta_label?: string;
  cta_url?: string;
  align?: "left" | "center";
  image_url?: string;
};

export type GalleryImage = {
  /** Runtime/upload; not in PY repeatable schema (alt/caption only). */
  url: string;
  alt?: string;
  caption?: string;
};

export type GalleryData = {
  title?: string;
  images?: GalleryImage[];
};

export type CardItem = {
  heading?: string;
  text?: string;
  link_label?: string;
  link_url?: string;
};

export type CardsData = {
  title?: string;
  subtitle?: string;
  cards?: CardItem[];
};

export type TestimonialItem = {
  author?: string;
  role?: string;
  quote?: string;
};

export type TestimonialsData = {
  title?: string;
  items?: TestimonialItem[];
};

export type CTAData = {
  headline?: string;
  subtext?: string;
  button_label?: string;
  button_url?: string;
};

/**
 * Fingerprint for drift guard — field keys (+ image_fields values + repeatable
 * inner keys). Gallery `url` is runtime-only and must NOT appear here.
 */
export const CANONICAL_BLOCK_PARITY: Record<
  CanonicalBlockType,
  { fields: readonly string[]; repeatable?: Record<string, readonly string[]> }
> = {
  RichSection: {
    fields: ["title", "body", "cta_label", "cta_url", "align", "image_url"],
  },
  Gallery: {
    fields: ["title"],
    repeatable: { images: ["alt", "caption"] },
  },
  Cards: {
    fields: ["title", "subtitle"],
    repeatable: { cards: ["heading", "text", "link_label", "link_url"] },
  },
  Testimonials: {
    fields: ["title"],
    repeatable: { items: ["author", "role", "quote"] },
  },
  CTA: {
    fields: ["headline", "subtext", "button_label", "button_url"],
  },
};
